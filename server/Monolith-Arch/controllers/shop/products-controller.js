const Product = require("../../models/Product");
const product_map = require("./product_map.json");
const { getCache, setCache, clearCache } = require("../../helpers/Redis");

// Helper to generate cache keys
const getCacheKey = (type, identifier) => `products:${type}:${identifier}`;

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], sortBy = "price-lowtohigh" } = req.query;
    const cacheKey = getCacheKey('filtered', `${category}-${sortBy}`);

    // Try cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Build query
    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    let sort = { price: 1 }; // Default sort
    if (sortBy === "price-hightolow") sort.price = -1;
    if (sortBy === "title-atoz") sort = { title: 1 };
    if (sortBy === "title-ztoa") sort = { title: -1 };

    // Fetch from DB
    const products = await Product.find(filters).sort(sort);
    const response = { success: true, data: products };

    // Cache results
    await setCache(cacheKey, response, 600); // 10 minutes

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = getCacheKey('detail', id);

    // Try cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      //console.log("redis");
      
      return res.json(cachedData);
    }

    // Fetch from DB
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!"
      });
    }

    const response = { success: true, data: product };

    // Cache results
    await setCache(cacheKey, response, 3600); // 1 hour

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getSuggestedProducts = async (req, res) => {
  try {
    const { state, month, crop } = req.body;
    if (!state || !month || !crop) {
      return res.status(400).json({ error: "State, month, and crop are required" });
    }

    const cacheKey = getCacheKey('suggested', `${state}-${month}-${crop}`);

    // Try cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Get product titles
    const titles = product_map?.[state]?.[month]?.[crop];
    if (!titles || !Array.isArray(titles)) {
      return res.status(404).json({ error: "No product mapping found" });
    }

    // Fetch from DB
    const products = await Product.find({ title: { $in: titles } });
    const response = { products };

    // Cache results
    await setCache(cacheKey, response, 86400); // 24 hours

    res.json(response);
  } catch (error) {
    console.error("Error fetching suggested products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getFilteredProducts,
  getProductDetails,
  getSuggestedProducts
};