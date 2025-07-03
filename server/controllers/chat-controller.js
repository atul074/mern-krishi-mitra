const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, senderId, message, role } = req.body;
    const newMessage = await Message.create({ roomId, senderId, message, role });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};

exports.getMessagesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ roomId: userId }).sort({ timestamp: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};

exports.getAllChatUsers = async (req, res) => {
  try {
    const users = await Message.distinct("roomId");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to get chat users" });
  }
};