import express from "express";
import { registerUser, loginUser, logoutUser, authMiddleware } from "../controller/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 */
router.post("/logout", logoutUser);

/**
 * @swagger
 * /api/auth/check-auth:
 *   get:
 *     summary: Check if user is authenticated
 */
router.get("/check-auth", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
