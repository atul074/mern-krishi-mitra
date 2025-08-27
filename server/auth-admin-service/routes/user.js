import express from "express";
import { fetchAllUsers } from "../controller/user.js";
import { sendMessage } from "../utility/producer.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/users/get:
 *   get:
 *     summary: Fetch all users
 *     description: Returns a list of all users with details
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "688b17f84854d56c5fbeace2"
 *                       userName:
 *                         type: string
 *                         example: "atul"
 *                       email:
 *                         type: string
 *                         example: "test@gmail.com"
 *                       password:
 *                         type: string
 *                         example: "$2a$12$49oAPqBh64ZjVqE072qf/e4eVYKm0Or6C0XEUFIvHFeieC7ZXz3Ja"
 *                       role:
 *                         type: string
 *                         example: "user"
 *                       __v:
 *                         type: number
 *                         example: 0
 *       500:
 *         description: Internal server error
 */
router.get("/get", async (req, res) => {
    try {
      await fetchAllUsers(req, res); // your controller returns response
      await sendMessage("user-activity", { action: "fetch-users" }); // Kafka event
    } catch (err) {
      console.log("Kafka error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  

export default router;
