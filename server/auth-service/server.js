// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.js";

import { setupSwagger } from "./utility/swagger.js";
import { connectRabbitMQ, closeConnection } from "./utility/rabbitmq.js";
import { metricsMiddleware, metricsEndpoint } from "./utility/prometheus.js"; // exports: metricsMiddleware, metricsEndpoint

dotenv.config();
const app = express();

/* --------- Middleware --------- */
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Prometheus request metrics middleware (measures all routes)
app.use(metricsMiddleware);

/* --------- Authentication Routes Only --------- */
app.use("/api/auth", authRouter);

/* --------- Swagger --------- */
setupSwagger(app); // exposes /api-docs

/* --------- Prometheus metrics endpoint --------- */
app.get("/metrics", metricsEndpoint);

/* --------- Health Check --------- */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth Service is healthy",
    service: "authentication",
    timestamp: new Date().toISOString()
  });
});

/* --------- Start services and connect to DB --------- */
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB connected");

    // Connect RabbitMQ (non-blocking - if it fails, server still comes up)
    try {
      await connectRabbitMQ();
      console.log("✅ RabbitMQ connected");
    } catch (rmqError) {
      console.error("❌ RabbitMQ connect error (server will still start):", rmqError.message);
    }

    app.listen(PORT, () => {
      console.log(`
🔐 Authentication Service Started Successfully!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Client URL: ${process.env.CLIENT_URL}

🛡️  Available Routes:
  📝 POST /api/auth/register    - User registration
  🔑 POST /api/auth/login       - User login  
  🚪 POST /api/auth/logout      - User logout
  ✅ GET  /api/auth/check-auth  - Check authentication
  ❤️  GET  /health              - Health check
  📊 GET  /metrics              - Prometheus metrics
  📚 GET  /api-docs             - API documentation
      `);
    });
  } catch (err) {
    console.error("❌ Failed to start authentication service:", err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Gracefully shutting down authentication service...');
  
  try {
    await closeConnection();
    await mongoose.connection.close();
    console.log('✅ All connections closed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
});
