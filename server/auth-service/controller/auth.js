import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { publishAuthEvent } from "../utility/rabbitmq.js";
import { Counter } from "prom-client";

// Prometheus metrics
const requestCounter = new Counter({
  name: "auth_requests_total",
  help: "Total Auth API requests",
  labelNames: ["method", "route", "status"]
});

// Helper to count requests
const countRequest = (req, res) => {
  res.on("finish", () => {
    requestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
};

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      role: user.role || 'user',
      userName: user.userName || user.name
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: "7d" }
  );
};

// Register User
const registerUser = async (req, res) => {
  countRequest(req, res);
  try {
    const { userName, email, password, roomNo, dept, hostelNo, phoneNo } = req.body;

    // Validation
    if (!userName || !email || !password || !roomNo || !dept || !hostelNo || !phoneNo) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { userName }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email or username already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const newUser = await User.create({ 
      userName, 
      email, 
      password: hashedPassword,
      role: 'user',
      roomNo,
      dept,
      hostelNo,
      phoneNo
    });

    // Remove password from response
    const userResponse = {
      id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      role: newUser.role,
      roomNo: newUser.roomNo,
      dept: newUser.dept,
      hostelNo: newUser.hostelNo,
      phoneNo: newUser.phoneNo
    };

    // RabbitMQ event
    try {
      await publishAuthEvent("USER_REGISTERED", userResponse);
    } catch (messagingError) {
      console.error("Messaging publish error:", messagingError.message);
    }

    res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      user: userResponse 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error during registration" 
    });
  }
};


// Login User
const loginUser = async (req, res) => {
  countRequest(req, res);
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate token
    const token = generateToken(user);

    // User response without password
    const userResponse = {
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      roomNo: user.roomNo,
      dept: user.dept,
      hostelNo: user.hostelNo,
      phoneNo: user.phoneNo
    };

    // RabbitMQ event
    try {
      await publishAuthEvent("USER_LOGIN", { userId: user._id, email: user.email });
    } catch (messagingError) {
      console.error("Messaging publish error:", messagingError.message);
    }

    // Set cookie and send response
    res.cookie("token", token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }).status(200).json({ 
      success: true, 
      message: "Login successful",
      user: userResponse 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error during login" 
    });
  }
};


// Logout User
const logoutUser = async (req, res) => {
  countRequest(req, res);
  try {
    // RabbitMQ event
    try {
      if (req.user) {
        await publishAuthEvent("USER_LOGOUT", { userId: req.user.id });
      }
    } catch (messagingError) {
      console.error("Messaging publish error:", messagingError.message);
    }

    res.clearCookie("token").status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error during logout" 
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  countRequest(req, res);
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found with this email" 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to user
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // RabbitMQ event for password reset request
    try {
      await publishAuthEvent("PASSWORD_RESET_REQUEST", { 
        userId: user._id, 
        email: user.email,
        resetToken,
        resetTokenExpiry
      });
    } catch (messagingError) {
      console.error("Messaging publish error:", messagingError.message);
    }

    res.status(200).json({ 
      success: true, 
      message: "Password reset token sent successfully",
      resetToken // In production, this should be sent via email
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error during password reset request" 
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  countRequest(req, res);
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Token and new password are required" 
      });
    }

    // Hash the token to match with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired reset token" 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // RabbitMQ event
    try {
      await publishAuthEvent("PASSWORD_RESET_SUCCESS", { userId: user._id, email: user.email });
    } catch (messagingError) {
      console.error("Messaging publish error:", messagingError.message);
    }

    res.status(200).json({ 
      success: true, 
      message: "Password reset successfully" 
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error during password reset" 
    });
  }
};

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access token is missing" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get fresh user data
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    req.user = {
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

// Admin Middleware
const adminMiddleware = async (req, res, next) => {
  try {
    // First run auth middleware
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Admin access required" 
      });
    }

    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    res.status(403).json({ 
      success: false, 
      message: "Admin access denied" 
    });
  }
};

export { 
  registerUser, 
  loginUser, 
  logoutUser, 
  forgotPassword, 
  resetPassword, 
  authMiddleware, 
  adminMiddleware 
};
