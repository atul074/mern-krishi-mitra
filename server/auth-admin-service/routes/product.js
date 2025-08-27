import express from "express";
import { addProduct, editProduct, deleteProduct, fetchAllProducts } from "../controller/product.js";


const router = express.Router();

/**
 * @swagger
 * /api/admin/products/add:
 *   post:
 *     summary: Add a new product
 */
router.post("/add", addProduct);

/**
 * @swagger
 * /api/admin/products/edit/{id}:
 *   put:
 *     summary: Edit product
 */
router.put("/edit/:id", editProduct);

/**
 * @swagger
 * /api/admin/products/delete/{id}:
 *   delete:
 *     summary: Delete product
 */
router.delete("/delete/:id", deleteProduct);

/**
 * @swagger
 * /api/admin/products/get:
 *   get:
 *     summary: Fetch all products
 *     description: Returns a list of all products with details
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "676c534b00a00b559606d84c"
 *                       image:
 *                         type: string
 *                         example: "http://res.cloudinary.com/de7imsn1h/image/upload/v1735152434/wduizx4ky5lzrdjurgbe.webp"
 *                       title:
 *                         type: string
 *                         example: "product1"
 *                       description:
 *                         type: string
 *                         example: "testing item"
 *                       category:
 *                         type: string
 *                         example: "PLANT NUTRITION"
 *                       price:
 *                         type: number
 *                         example: 400
 *                       salePrice:
 *                         type: number
 *                         example: 300
 *                       totalStock:
 *                         type: number
 *                         example: 96
 *                       averageReview:
 *                         type: number
 *                         example: 5
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-25T18:47:39.153Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-10T17:16:16.248Z"
 *                       __v:
 *                         type: number
 *                         example: 0
 *       500:
 *         description: Internal server error
 */
router.get("/get", fetchAllProducts);


export default router;
