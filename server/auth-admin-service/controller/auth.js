import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { producer } from "../utility/producer.js";
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

// Register User
const registerUser = async (req, res) => {
  countRequest(req, res);
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Kafka event
    await producer.send({
      topic: "auth-events",
      messages: [{ value: JSON.stringify({ type: "USER_REGISTERED", data: newUser }) }],
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  countRequest(req, res);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true }).status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Logout User
const logoutUser = async (req, res) => {
  countRequest(req, res);
  res.clearCookie("token").status(200).json({ success: true, message: "Logged out successfully" });
};

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export { registerUser, loginUser, logoutUser, authMiddleware };
