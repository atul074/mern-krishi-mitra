const express = require("express");
const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} = require("../controller/cart");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management APIs
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f9b82a9c123abcde4567f"
 *               productId:
 *                 type: string
 *                 example: "64f9b92a9c123abcde4568g"
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart
 */
router.post("/add", addToCart);

/**
 * @swagger
 * /cart/get/{userId}:
 *   get:
 *     summary: Fetch cart items of a user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "64f9b82a9c123abcde4567f"
 *     responses:
 *       200:
 *         description: Cart items fetched
 */
router.get("/get/:userId", fetchCartItems);

/**
 * @swagger
 * /cart/update-cart:
 *   put:
 *     summary: Update quantity of an item in the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f9b82a9c123abcde4567f"
 *               productId:
 *                 type: string
 *                 example: "64f9b92a9c123abcde4568g"
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated
 */
router.put("/update-cart", updateCartItemQty);

/**
 * @swagger
 * /cart/{userId}/{productId}:
 *   delete:
 *     summary: Remove a product from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 */
router.delete("/:userId/:productId", deleteCartItem);

module.exports = router;
