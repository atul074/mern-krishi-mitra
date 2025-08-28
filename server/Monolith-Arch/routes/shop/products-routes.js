const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getSuggestedProducts,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.post("/suggested",getSuggestedProducts);

module.exports = router;