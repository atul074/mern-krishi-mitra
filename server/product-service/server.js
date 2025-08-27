const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// Load environment variables
dotenv.config();

// Routes
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

// Utilities
const { metricsMiddleware, register: promRegister } = require("./utility/metrics");
const { connectRabbitMQ } = require("./utility/rabbitmq");
const setupSwagger = require("./utility/swagger");

const app = express();

// ---------- MIDDLEWARES ----------
app.use(
  cors({ origin: process.env.CLIENT_URL, credentials: true })
);
app.use(cookieParser());
app.use(express.json());
app.use(metricsMiddleware);

// ---------- ROUTES ----------
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// ---------- SWAGGER ----------
setupSwagger(app);

// ---------- PROMETHEUS METRICS ENDPOINT ----------
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promRegister.contentType);
  res.end(await promRegister.metrics());
});

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB connected");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error.message);
      process.exit(1); // stop if DB fails
    }
  };

// ---------- RABBITMQ ----------
connectRabbitMQ();

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  });
