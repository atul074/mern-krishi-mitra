import express from "express";
import {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "../controller/order.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/orders/get:
 *   get:
 *     summary: Get all orders of all users
 *     responses:
 *       200:
 *         description: List of all orders
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
 *                       userId:
 *                         type: string
 *                       cartId:
 *                         type: string
 *                       cartItems:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: string
 *                             title:
 *                               type: string
 *                             image:
 *                               type: string
 *                             price:
 *                               type: string
 *                             quantity:
 *                               type: number
 *                             _id:
 *                               type: string
 *                       addressInfo:
 *                         type: object
 *                         properties:
 *                           addressId:
 *                             type: string
 *                           address:
 *                             type: string
 *                           city:
 *                             type: string
 *                           pincode:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           notes:
 *                             type: string
 *                       orderStatus:
 *                         type: string
 *                       paymentMethod:
 *                         type: string
 *                       paymentStatus:
 *                         type: string
 *                       totalAmount:
 *                         type: number
 *                       orderDate:
 *                         type: string
 *                         format: date-time
 *                       orderUpdateDate:
 *                         type: string
 *                         format: date-time
 *                       paymentId:
 *                         type: string
 *                       payerId:
 *                         type: string
 *                       __v:
 *                         type: number
 */
router.get("/get", getAllOrdersOfAllUsers);


/**
 * @swagger
 * /api/admin/orders/details/{id}:
 *   get:
 *     summary: Get order details for admin
 */
router.get("/details/:id", getOrderDetailsForAdmin);

/**
 * @swagger
 * /api/admin/orders/update/{id}:
 *   put:
 *     summary: Update order status
 */
router.put("/update/:id", updateOrderStatus);

export default router;
