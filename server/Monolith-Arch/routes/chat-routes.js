const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat-controller");

router.post("/send", chatController.sendMessage);
router.get("/user/:userId", chatController.getMessagesByUser);
router.get("/users", chatController.getAllChatUsers);

module.exports = router;
