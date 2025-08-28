import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true 
  }, // userId for admin chat or conversationId for one-to-one
  senderId: { 
    type: String, 
    required: true 
  },
  receiverId: { 
    type: String, 
    required: false // For one-to-one chats
  },
  conversationId: { 
    type: String, 
    required: false // Generated ID for one-to-one conversations
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file", "system"],
    default: "text"
  },
  chatType: {
    type: String,
    enum: ["admin_support", "one_to_one", "group"],
    default: "admin_support"
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true,
  collection: 'messages'
});

// Indexes for better query performance
messageSchema.index({ roomId: 1, timestamp: 1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ receiverId: 1 });
messageSchema.index({ conversationId: 1, timestamp: 1 });
messageSchema.index({ chatType: 1 });

export default mongoose.model('Message', messageSchema);
