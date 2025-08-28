const Message = require("../models/Message");
const User = require("../models/User");

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
    
    const userIds = await Message.distinct("roomId");

    const users = await User.find({ _id: { $in: userIds } }, "_id userName");

    const formattedUsers = users.map((user) => ({
      id: user._id,
      userName: user.userName,
    }));

    res.status(200).json({ success: true, data: formattedUsers });
  } catch (error) {
    console.error("Error fetching chat users:", error);
    res.status(500).json({ success: false, error: "Failed to get chat users" });
  }
};