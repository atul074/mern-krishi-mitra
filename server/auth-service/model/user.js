import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: "user",
  },
  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpires: {
    type: Date,
    default: undefined
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },

  
  roomNo: {
    type: String,
    trim: true
  },
  dept: {
    type: String,
    trim: true
  },
  hostelNo: {
    type: String,
    trim: true
  },
  phoneNo: {
    type: String,
    trim: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  }

}, {
  timestamps: true
});

// Index for performance
UserSchema.index({ email: 1 });
UserSchema.index({ userName: 1 });
UserSchema.index({ resetPasswordToken: 1 });

const User = mongoose.model("User", UserSchema);
export default User;
