import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import RabbitMQService from '../utils/rabbitmq.js';
import { 
  generateConversationId, 
  getOneToOneRoomName, 
  validateMessageData,
  formatMessageForClient 
} from '../utils/chatHelpers.js';

const router = express.Router();

// Send message (REST API alternative to socket)
router.post('/send', async (req, res) => {
  try {
    const messageData = req.body;
    const validation = validateMessageData(messageData);
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: validation.error 
      });
    }
    
    const { senderId, receiverId, message, role = "user", chatType, roomId } = messageData;
    let newMessage;
    
    if (chatType === "one_to_one") {
      const conversationId = generateConversationId(senderId, receiverId);
      const roomName = getOneToOneRoomName(senderId, receiverId);
      
      newMessage = await Message.create({
        senderId,
        receiverId,
        conversationId,
        roomId: roomName,
        message,
        role,
        chatType: "one_to_one",
        messageType: "text",
        timestamp: new Date()
      });
    } else {
      newMessage = await Message.create({ 
        roomId,
        senderId,
        message,
        role,
        chatType: chatType || "admin_support",
        messageType: "text",
        timestamp: new Date()
      });
    }
    
    // Publish to RabbitMQ
    await RabbitMQService.publishMessage('chat.message.sent', {
      type: 'MESSAGE_SENT',
      data: newMessage
    });
    
    res.status(201).json({ success: true, data: formatMessageForClient(newMessage) });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// Get messages by user/room (existing route - works for admin support)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({ 
      roomId: userId,
      chatType: "admin_support" 
    })
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const totalMessages = await Message.countDocuments({ 
      roomId: userId,
      chatType: "admin_support" 
    });
    
    res.json({ 
      success: true, 
      data: messages.reverse().map(formatMessageForClient),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalMessages,
        pages: Math.ceil(totalMessages / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// Get one-to-one conversation
router.get('/conversation/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const conversationId = generateConversationId(userId1, userId2);
    
    const messages = await Message.find({ 
      conversationId,
      chatType: "one_to_one"
    })
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const totalMessages = await Message.countDocuments({ 
      conversationId,
      chatType: "one_to_one" 
    });
    
    res.json({ 
      success: true, 
      data: messages.reverse().map(formatMessageForClient),
      conversationId,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalMessages,
        pages: Math.ceil(totalMessages / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching conversation:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversation' });
  }
});

// Get all conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all conversations where user is sender or receiver
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ],
          chatType: "one_to_one"
        }
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $last: "$message" },
          lastMessageTime: { $last: "$timestamp" },
          participants: { $addToSet: { $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"] } },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiverId", userId] }, { $eq: ["$isRead", false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);
    
    // Get user details for participants
    const conversationsWithUserDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.participants[0];
        const otherUser = await User.findById(otherUserId, 'userName email isOnline lastSeen');
        
        return {
          conversationId: conv._id,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
          otherUser: otherUser ? {
            id: otherUser._id,
            userName: otherUser.userName,
            email: otherUser.email,
            isOnline: otherUser.isOnline,
            lastSeen: otherUser.lastSeen
          } : null,
          unreadCount: conv.unreadCount
        };
      })
    );
    
    res.json({ 
      success: true, 
      data: conversationsWithUserDetails 
    });
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
});

// Get all chat users
router.get('/users', async (req, res) => {
  try {
    const userIds = await Message.distinct("roomId");
    const users = await User.find({ _id: { $in: userIds } }, "_id userName email role isOnline lastSeen");
    
    const formattedUsers = users.map((user) => ({
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen
    }));
    
    res.json({ success: true, data: formattedUsers });
  } catch (error) {
    console.error('❌ Error fetching chat users:', error);
    res.status(500).json({ success: false, message: 'Failed to get chat users' });
  }
});

// Mark messages as read
router.put('/messages/read', async (req, res) => {
  try {
    const { messageIds, conversationId, userId } = req.body;
    
    let updateQuery = {};
    if (messageIds && messageIds.length > 0) {
      updateQuery._id = { $in: messageIds };
    } else if (conversationId) {
      updateQuery.conversationId = conversationId;
      updateQuery.receiverId = userId;
      updateQuery.isRead = false;
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Either messageIds or conversationId with userId required' 
      });
    }
    
    const result = await Message.updateMany(updateQuery, {
      isRead: true,
      readAt: new Date()
    });
    
    res.json({ 
      success: true, 
      message: `${result.modifiedCount} messages marked as read` 
    });
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark messages as read' });
  }
});

// Search users for starting conversations
router.get('/search/users', async (req, res) => {
  try {
    const { query, excludeUserId } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }
    
    const searchRegex = new RegExp(query, 'i');
    const searchQuery = {
      $or: [
        { userName: searchRegex },
        { email: searchRegex }
      ]
    };
    
    if (excludeUserId) {
      searchQuery._id = { $ne: excludeUserId };
    }
    
    const users = await User.find(searchQuery, 'userName email isOnline lastSeen')
      .limit(20)
      .sort({ userName: 1 });
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      userName: user.userName,
      email: user.email,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen
    }));
    
    res.json({ 
      success: true, 
      data: formattedUsers 
    });
  } catch (error) {
    console.error('❌ Error searching users:', error);
    res.status(500).json({ success: false, message: 'Failed to search users' });
  }
});

// Mark user as online/offline
router.post('/user/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isOnline } = req.body;
    
    await User.findByIdAndUpdate(userId, {
      isOnline,
      lastSeen: new Date()
    });
    
    // Publish status change
    await RabbitMQService.publishMessage('user.status.changed', {
      type: 'USER_STATUS_CHANGED',
      data: { userId, isOnline, timestamp: new Date() }
    });
    
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('❌ Error updating user status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// Get chat statistics
router.get('/stats', async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const activeUsers = await User.countDocuments({ isOnline: true });
    const totalUsers = await User.countDocuments();
    const todayMessages = await Message.countDocuments({
      timestamp: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    
    const oneToOneChats = await Message.countDocuments({ chatType: "one_to_one" });
    const adminSupportChats = await Message.countDocuments({ chatType: "admin_support" });
    
    res.json({
      success: true,
      data: {
        totalMessages,
        activeUsers,
        totalUsers,
        todayMessages,
        oneToOneChats,
        adminSupportChats
      }
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

export default router;
