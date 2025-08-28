import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import RabbitMQService from '../utils/rabbitmq.js';

const router = express.Router();

// Send message
router.post('/send', async (req, res) => {
  try {
    const { roomId, senderId, message, role } = req.body;
    
    if (!roomId || !senderId || !message || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: roomId, senderId, message, role' 
      });
    }
    
    const newMessage = await Message.create({ 
      roomId, 
      senderId, 
      message, 
      role,
      timestamp: new Date()
    });
    
    // Publish to RabbitMQ
    await RabbitMQService.publishMessage('chat.message.sent', {
      type: 'MESSAGE_SENT',
      data: newMessage
    });
    
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// Get messages by user/room
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({ roomId: userId })
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const totalMessages = await Message.countDocuments({ roomId: userId });
    
    res.json({ 
      success: true, 
      data: messages.reverse(), // Reverse to show oldest first
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
    
    res.json({
      success: true,
      data: {
        totalMessages,
        activeUsers,
        totalUsers,
        todayMessages
      }
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

export default router;
