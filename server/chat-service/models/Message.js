import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true 
  }, // userId for the chat room
  senderId: { 
    type: String, 
    required: true 
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
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true,
  collection: 'messages'
});

// Index for better query performance
messageSchema.index({ roomId: 1, timestamp: 1 });
messageSchema.index({ senderId: 1 });

export default mongoose.model('Message', messageSchema);
