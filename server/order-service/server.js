// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { metricsMiddleware, register } = require("./utility/metrics");
const { connectRabbitMQ } = require("./utility/rabbitmq");
const swaggerDocs = require("./utility/swagger");
const orderRoutes = require("./routes/order");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(metricsMiddleware);

// Routes
app.use("/api/orders", orderRoutes);

// Prometheus endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

// Swagger docs
swaggerDocs(app);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  await connectRabbitMQ();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Prometheus metrics available at http://localhost:${PORT}/metrics`);
    console.log(`📖 Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
})();
