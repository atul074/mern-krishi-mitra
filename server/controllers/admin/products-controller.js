const Product = require("../../models/Product");
const { imageUploadUtil } = require("../../helpers/cloudinary");
const { clearCache } = require("../../helpers/redis");

// Clear all product-related caches
const clearProductCaches = async () => {
  await clearCache('products:*');
};

const addProduct = async (req, res) => {
  try {
    const { image, title, description, category, price, salePrice, totalStock } = req.body;
  
    const newProduct = new Product({
      image,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      averageReview: 0 // Default value
    });
  
    await newProduct.save();
    
    // Clear all product caches
    await clearProductCaches();
    
    res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error adding product"
    });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error fetching products"
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    // Clear all product caches
    await clearProductCaches();
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error updating product"
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    // Clear all product caches
    await clearProductCaches();
    
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error deleting product"
    });
  }
};

const handleImageUpload = async (req, res) => {
    try {
      console.log(req.body);
      
      // const b64 = Buffer.from(req.file.buffer).toString("base64");
      // console.log("atul2");
      // const url = "data:" + req.file.mimetype + ";base64," + b64;
      // console.log("atul3");
      
      // const result = await imageUploadUtil(url);
  
      // res.json({
      //   success: true,
      //   result,
      // });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Error occured",
      });
    }
  };

module.exports = {
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct
};