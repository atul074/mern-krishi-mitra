import Product from "../model/product.js";
import { producer } from "../utility/producer.js";
import { Counter } from "prom-client";
import { setCache, getCache, clearCache } from "../utility/redis.js";


// Prometheus metrics
const requestCounter = new Counter({
  name: "admin_products_requests_total",
  help: "Total Admin Products API requests",
  labelNames: ["method", "route", "status"]
});

const countRequest = (req, res) => {
  res.on("finish", () => {
    requestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
};

// Add Product
const addProduct = async (req, res) => {
  countRequest(req, res);
  try {
    const product = await Product.create(req.body);

    // Send Kafka Event
    await producer.send({
      topic: "product-events",
      messages: [{ value: JSON.stringify({ type: "PRODUCT_ADDED", data: product }) }]
    });

    // Invalidate cache
    await clearCache("products*");

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Edit Product
const editProduct = async (req, res) => {
  countRequest(req, res);
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await producer.send({
      topic: "product-events",
      messages: [{ value: JSON.stringify({ type: "PRODUCT_UPDATED", data: updated }) }]
    });

    // Invalidate cache
    await clearCache("products*");

    res.status(200).json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  countRequest(req, res);
  try {
    await Product.findByIdAndDelete(req.params.id);

    await producer.send({
      topic: "product-events",
      messages: [{ value: JSON.stringify({ type: "PRODUCT_DELETED", data: req.params.id }) }]
    });

    // Invalidate cache
    await clearCache("products*");

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch All Products with Redis Cache
const fetchAllProducts = async (req, res) => {
  countRequest(req, res);
  try {
    // Try Redis first
    const cached = await getCache("products:all");
    if (cached) {
      return res.status(200).json({ success: true, products: cached, source: "cache" });
    }

    // If not in cache, fetch from DB
    const products = await Product.find();

    // Cache result
    await setCache("products:all", products, 3600); // cache for 1 hour

    res.status(200).json({ success: true, products, source: "db" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export  { addProduct, editProduct, deleteProduct, fetchAllProducts };
