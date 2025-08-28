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

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/krishi-chat';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`👤 User connected: ${socket.id}`);

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`🏠 Socket ${socket.id} joined room: ${roomId}`);
    
    // Publish user joined event
    RabbitMQService.publishMessage('chat.user.joined', {
      type: 'USER_JOINED',
      data: { roomId, socketId: socket.id, timestamp: new Date() }
    });
  });

  socket.on("sendMessage", async ({ roomId, senderId, message, role }) => {
    try {
      const newMessage = await Message.create({ 
        roomId, 
        senderId, 
        message, 
        role,
        timestamp: new Date()
      });
      
      // Emit to room
      io.to(roomId).emit("receiveMessage", newMessage);
      
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

  socket.on("disconnect", () => {
    console.log(`👋 User disconnected: ${socket.id}`);
    
    // Publish user left event
    RabbitMQService.publishMessage('chat.user.left', {
      type: 'USER_LEFT',
      data: { socketId: socket.id, timestamp: new Date() }
    });
  });
});

// Routes
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'chat-service', 
    timestamp: new Date().toISOString(),
    connections: io.sockets.sockets.size
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
