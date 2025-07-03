const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  roomId: String, // userId
  senderId: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);