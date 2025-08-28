import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import Message from './models/Message.js';
import User from './models/User.js';
import chatRoutes from './routes/chat.js';
import RabbitMQService from './utils/rabbitmq.js';
import EventConsumer from './consumers/eventConsumer.js';
import { 
  generateConversationId, 
  getOneToOneRoomName, 
  getAdminSupportRoomName,
  validateMessageData,
  formatMessageForClient 
} from './utils/chatHelpers.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store connected users
const connectedUsers = new Map(); // userId -> { socketId, isOnline, lastSeen }
const typingUsers = new Map(); // conversationId -> Set of userIds

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/krishi-chat';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`👤 User connected: ${socket.id}`);

  // Handle user authentication and registration
  socket.on("userConnect", async ({ userId, userName }) => {
    try {
      socket.userId = userId;
      socket.userName = userName;
      
      // Store connected user
      connectedUsers.set(userId, {
        socketId: socket.id,
        isOnline: true,
        lastSeen: new Date(),
        userName
      });
      
      // Update user status in database
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date()
      });
      
      // Notify other users about online status
      socket.broadcast.emit("userOnline", { userId, userName });
      
      console.log(`✅ User ${userName} (${userId}) connected`);
      
      // Join personal room for receiving messages
      socket.join(`user_${userId}`);
      
    } catch (error) {
      console.error("❌ Error in userConnect:", error);
      socket.emit("error", { message: "Failed to connect user" });
    }
  });

  // Handle joining specific chat rooms
  socket.on("joinRoom", ({ roomId, chatType = "admin_support" }) => {
    socket.join(roomId);
    console.log(`🏠 Socket ${socket.id} joined room: ${roomId} (${chatType})`);
    
    // Publish user joined event
    RabbitMQService.publishMessage('chat.user.joined', {
      type: 'USER_JOINED',
      data: { roomId, socketId: socket.id, userId: socket.userId, chatType, timestamp: new Date() }
    });
  });

  // Handle one-to-one chat initiation
  socket.on("startOneToOneChat", ({ receiverId }) => {
    try {
      if (!socket.userId) {
        socket.emit("error", { message: "User not authenticated" });
        return;
      }
      
      const conversationId = generateConversationId(socket.userId, receiverId);
      const roomName = getOneToOneRoomName(socket.userId, receiverId);
      
      // Join the conversation room
      socket.join(roomName);
      
      // Notify the receiver if they're online
      const receiverSocket = Array.from(io.sockets.sockets.values())
        .find(s => s.userId === receiverId);
      
      if (receiverSocket) {
        receiverSocket.join(roomName);
        receiverSocket.emit("oneToOneChatInvitation", {
          conversationId,
          senderId: socket.userId,
          senderName: socket.userName,
          roomName
        });
      }
      
      socket.emit("oneToOneChatStarted", {
        conversationId,
        receiverId,
        roomName
      });
      
      console.log(`💬 One-to-one chat started: ${socket.userId} -> ${receiverId}`);
      
    } catch (error) {
      console.error("❌ Error starting one-to-one chat:", error);
      socket.emit("error", { message: "Failed to start chat" });
    }
  });

  // Handle sending messages (both admin support and one-to-one)
  socket.on("sendMessage", async (messageData) => {
    try {
      const validation = validateMessageData(messageData);
      if (!validation.isValid) {
        socket.emit("error", { message: validation.error });
        return;
      }
      
      const { chatType, receiverId, roomId, message, role = "user" } = messageData;
      let newMessage;
      
      if (chatType === "one_to_one") {
        // One-to-one chat message
        const conversationId = generateConversationId(socket.userId, receiverId);
        const roomName = getOneToOneRoomName(socket.userId, receiverId);
        
        newMessage = await Message.create({
          senderId: socket.userId,
          receiverId,
          conversationId,
          roomId: roomName,
          message,
          role,
          chatType: "one_to_one",
          messageType: "text",
          timestamp: new Date()
        });
        
        // Send to both users in the conversation
        io.to(roomName).emit("receiveMessage", formatMessageForClient(newMessage));
        
        // Send push notification to receiver if offline
        const receiverConnection = connectedUsers.get(receiverId);
        if (!receiverConnection?.isOnline) {
          await RabbitMQService.publishMessage('user.notification.push', {
            type: 'NEW_MESSAGE',
            data: { 
              userId: receiverId, 
              senderId: socket.userId,
              senderName: socket.userName,
              message: message.substring(0, 50) + (message.length > 50 ? '...' : '')
            }
          });
        }
        
      } else {
        // Admin support chat message
        newMessage = await Message.create({
          roomId,
          senderId: socket.userId,
          message,
          role,
          chatType: "admin_support",
          messageType: "text",
          timestamp: new Date()
        });
        
        // Send to room
        io.to(roomId).emit("receiveMessage", formatMessageForClient(newMessage));
      }
      
      // Publish to RabbitMQ
      await RabbitMQService.publishMessage('chat.message.sent', {
        type: 'MESSAGE_SENT',
        data: newMessage
      });
      
    } catch (err) {
      console.error("❌ Failed to save or send message:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle typing indicators
  socket.on("typing", ({ conversationId, receiverId, isTyping }) => {
    try {
      if (!socket.userId) return;
      
      if (conversationId) {
        // One-to-one chat typing
        const roomName = getOneToOneRoomName(socket.userId, receiverId);
        socket.to(roomName).emit("userTyping", {
          userId: socket.userId,
          userName: socket.userName,
          conversationId,
          isTyping
        });
      } else {
        // Admin support typing
        socket.to(`admin_support_${socket.userId}`).emit("userTyping", {
          userId: socket.userId,
          userName: socket.userName,
          isTyping
        });
      }
    } catch (error) {
      console.error("❌ Error handling typing indicator:", error);
    }
  });

  // Handle message read status
  socket.on("markAsRead", async ({ messageId, conversationId }) => {
    try {
      await Message.findByIdAndUpdate(messageId, {
        isRead: true,
        readAt: new Date()
      });
      
      if (conversationId) {
        const roomName = conversationId.startsWith('conv_') 
          ? getOneToOneRoomName(...conversationId.replace('conv_', '').split('_'))
          : conversationId;
        
        io.to(roomName).emit("messageRead", { messageId, readAt: new Date() });
      }
      
    } catch (error) {
      console.error("❌ Error marking message as read:", error);
    }
  });

  // Handle getting online users
  socket.on("getOnlineUsers", () => {
    const onlineUsers = Array.from(connectedUsers.entries()).map(([userId, data]) => ({
      userId,
      userName: data.userName,
      isOnline: data.isOnline,
      lastSeen: data.lastSeen
    }));
    
    socket.emit("onlineUsers", onlineUsers);
  });

  // Handle disconnection
  socket.on("disconnect", async () => {
    console.log(`👋 User disconnected: ${socket.id}`);
    
    if (socket.userId) {
      // Update user status
      connectedUsers.set(socket.userId, {
        ...connectedUsers.get(socket.userId),
        isOnline: false,
        lastSeen: new Date()
      });
      
      // Update database
      try {
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          lastSeen: new Date()
        });
      } catch (error) {
        console.error("❌ Error updating user offline status:", error);
      }
      
      // Notify other users
      socket.broadcast.emit("userOffline", { 
        userId: socket.userId, 
        lastSeen: new Date() 
      });
      
      // Publish user left event
      await RabbitMQService.publishMessage('chat.user.left', {
        type: 'USER_LEFT',
        data: { socketId: socket.id, userId: socket.userId, timestamp: new Date() }
      });
    }
  });
});

// Routes
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'chat-service', 
    version: '2.0.0',
    features: [
      'one-to-one-chat',
      'admin-support',
      'typing-indicators', 
      'online-status',
      'message-read-status',
      'rabbitmq-events'
    ],
    timestamp: new Date().toISOString(),
    connections: io.sockets.sockets.size,
    connectedUsers: connectedUsers.size
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Initialize services
async function initializeServices() {
  try {
    await RabbitMQService.connect();
    new EventConsumer(); // Initialize event consumers
    console.log('✅ All services initialized');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  
  try {
    await RabbitMQService.close();
    await mongoose.connection.close();
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
initializeServices();

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`🚀 Chat service running on port ${PORT}`);
  console.log(`🌐 Socket.IO server ready for connections`);
});
