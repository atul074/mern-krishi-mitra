const Product = require("../model/product");
const { getCache, setCache, clearCache } = require("../utility/redis");
const amqp = require("amqplib");
const client = require("prom-client");

// -------------------- Prometheus Setup --------------------
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // collect process metrics
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});

// -------------------- RabbitMQ Setup --------------------
let channel;
(async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await conn.createChannel();
    await channel.assertExchange("products", "topic", { durable: true });
    console.log("✅ RabbitMQ connected for ProductController");
  } catch (err) {
    console.error("❌ RabbitMQ connection failed:", err.message);
  }
})();
const publishEvent = async (event, data) => {
  if (!channel) return;
  channel.publish("products", event, Buffer.from(JSON.stringify(data)));
};

// -------------------- Helpers --------------------
const getCacheKey = (type, identifier) => `products:${type}:${identifier}`;
const clearProductCaches = async () => await clearCache("products:*");

// -------------------- Controllers --------------------

// 📌 Add Product
const addProduct = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { image, title, description, category, price, salePrice, totalStock, userId } = req.body;

    const newProduct = new Product({
      image,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      userId,
      reportCount: 0,
    });

    await newProduct.save();

    await clearProductCaches();
    await publishEvent("product.created", newProduct);

    res.status(201).json({ success: true, data: newProduct });
    end({ method: req.method, route: req.originalUrl, status_code: 201 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error adding product" });
    end({ method: req.method, route: req.originalUrl, status_code: 500 });
  }
};

// 📌 Get All Products
const fetchAllProducts = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const cacheKey = getCacheKey("all", "list");
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const products = await Product.find({});
    const response = { success: true, data: products };
    await setCache(cacheKey, response, 600);

    res.status(200).json(response);
    end({ method: req.method, route: req.originalUrl, status_code: 200 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error fetching products" });
    end({ method: req.method, route: req.originalUrl, status_code: 500 });
  }
};

// 📌 Get Product Details
const getProductDetails = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { id } = req.params;
    const cacheKey = getCacheKey("detail", id);

    const cachedData = await getCache(cacheKey);
    if (cachedData) return res.json(cachedData);

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    const response = { success: true, data: product };
    await setCache(cacheKey, response, 3600);

    res.json(response);
    end({ method: req.method, route: req.originalUrl, status_code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
    end({ method: req.method, route: req.originalUrl, status_code: 500 });
  }
};

// 📌 Filter Products
const getFilteredProducts = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { category = [], sortBy = "price-lowtohigh" } = req.query;
    const cacheKey = getCacheKey("filtered", `${category}-${sortBy}`);

    const cachedData = await getCache(cacheKey);
    if (cachedData) return res.json(cachedData);

    let filters = {};
    if (category.length) filters.category = { $in: category.split(",") };

    let sort = { price: 1 };
    if (sortBy === "price-hightolow") sort.price = -1;
    if (sortBy === "title-atoz") sort = { title: 1 };
    if (sortBy === "title-ztoa") sort = { title: -1 };

    const products = await Product.find(filters).sort(sort);
    const response = { success: true, data: products };

    await setCache(cacheKey, response, 600);

    res.json(response);
    end({ method: req.method, route: req.originalUrl, status_code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
    end({ method: req.method, route: req.originalUrl, status_code: 500 });
  }
};

// 📌 Search Products
const searchProducts = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({ success: false, message: "Keyword is required" });
    }

    const regEx = new RegExp(keyword, "i");
    const searchResults = await Product.find({
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
      ],
    });

    res.status(200).json({ success: true, data: searchResults });
    end({ method: req.method, route: req.originalUrl, status_code: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
    end({ method: req.method, route: req.originalUrl, status_code: 500 });
  }
};

// 📌 Edit Product
const editProduct = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    await clearProductCaches();
    await publishEvent("product.updated", product);

    res.status(200).json({ success: true, data: product });
    end({ method: req.method, route: req.originalUrl, status_code: 200 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error updating product" });
    end({ method: req.method, route: req.originalUrl, status_code: 500 });
  }
};

// 📌 Delete Product
const deleteProduct = async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    await clearProductCaches();
    await publishEvent("product.deleted", { id });

    res.status(200).json({ success: true, message: "Product deleted successfully" });
    end({ method: req.method, route: req.originalUrl, status_code: 200 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error deleting product" });
    end({ method: req.method, route: req.originalUrl, status_code: 500 });
  }
};

 const reportProduct = async (productId) => {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        { $inc: { reportCount: 1 } },
        { new: true }
      );
  
      if (!product) {
        throw new Error("Product not found");
      }
  
      return product;
    } catch (err) {
      console.error("Error reporting product:", err.message);
      throw err;
    }
  };
  
  // 🔹 Function to get all reported products
  const getReportedProducts = async () => {
    try {
      const reported = await Product.find({ reportCount: { $gt: 0 } }).sort({
        reportCount: -1, // highest reported first
      });
      return reported;
    } catch (err) {
      console.error("Error fetching reported products:", err.message);
      throw err;
    }
  };
  

module.exports = {
  addProduct,
  fetchAllProducts,
  getProductDetails,
  getFilteredProducts,
  searchProducts,
  editProduct,
  deleteProduct,
  reportProduct,
  getReportedProducts,
};
