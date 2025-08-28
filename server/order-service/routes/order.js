const express = require("express");
const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  sendSms,
} = require("../controller/order");

const router = express.Router();

/**
 * @swagger
 * /get:
 *   get:
 *     summary: Get all orders of all users
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get("/get", getAllOrdersOfAllUsers);

/**
 * @swagger
 * /details/admin/{id}:
 *   get:
 *     summary: Get order details for admin
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details for admin
 */
router.get("/details/admin/:id", getOrderDetailsForAdmin);

/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated order
 */
router.put("/update/:id", updateOrderStatus);

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create an order
 *     tags: [Orders]
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/create", createOrder);

/**
 * @swagger
 * /capture:
 *   post:
 *     summary: Capture PayPal payment
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Payment captured
 */
router.post("/capture", capturePayment);

/**
 * @swagger
 * /list/{userId}:
 *   get:
 *     summary: Get all orders by user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders of user
 */
router.get("/list/:userId", getAllOrdersByUser);

/**
 * @swagger
 * /details/{id}:
 *   get:
 *     summary: Get order details for a user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 */
router.get("/details/:id", getOrderDetails);

/**
 * @swagger
 * /sendSms:
 *   post:
 *     summary: Send SMS notification
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: SMS sent
 */
router.post("/sendSms", sendSms);

module.exports = router;
