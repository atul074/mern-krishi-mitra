const express = require("express");
//const { upload } = require("../../helpers/cloudinary");

const {
    addProduct,
    fetchAllProducts,
    getProductDetails,
    getFilteredProducts,
    searchProducts,
    editProduct,
    deleteProduct,
    reportProduct,
    getReportedProducts,
} = require("../controller/product"); 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /products/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               totalStock:
 *                 type: number
 *               image:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added successfully
 */
router.post("/add", addProduct);

/**
 * @swagger
 * /products/edit/{id}:
 *   put:
 *     summary: Edit a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               totalStock:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/edit/:id", editProduct);

/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/delete/:id", deleteProduct);

/**
 * @swagger
 * /products/get:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/get", fetchAllProducts);

/**
 * @swagger
 * /products/get/filtered:
 *   get:
 *     summary: Get filtered products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Filtered products
 */
router.get("/get/filtered", getFilteredProducts);

/**
 * @swagger
 * /products/get/{id}:
 *   get:
 *     summary: Get product details by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 */
router.get("/get/:id", getProductDetails);

/**
 * @swagger
 * /products/search/{keyword}:
 *   get:
 *     summary: Search products by keyword
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search/:keyword", searchProducts);

/**
 * @swagger
 * /products/report/{id}:
 *   post:
 *     summary: Report a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product report count updated
 */
router.post("/report/:id", reportProduct);

/**
 * @swagger
 * /products/reported:
 *   get:
 *     summary: Get all reported products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of reported products
 */
router.get("/reported", getReportedProducts);

module.exports = router;
