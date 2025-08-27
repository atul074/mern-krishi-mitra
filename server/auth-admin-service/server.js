// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.js";
import productsRouter from "./routes/product.js";
import ordersRouter from "./routes/order.js";
import usersRouter from "./routes/user.js";

import { setupSwagger } from "./utility/swagger.js";
import * as kafkaProducer from "./utility/producer.js";        // exports: connectProducer, sendMessage, producer
import { metricsMiddleware, metricsEndpoint } from "./utility/prometheus.js"; // exports: metricsMiddleware, metricsEndpoint

dotenv.config();
const app = express();

/* --------- Middleware --------- */
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Prometheus request metrics middleware (measures all routes)
app.use(metricsMiddleware);

/* --------- Routes --------- */
app.use("/api/auth", authRouter);
app.use("/api/admin/products", productsRouter);
app.use("/api/admin/orders", ordersRouter);
app.use("/api/admin/users", usersRouter);

/* --------- Swagger --------- */
setupSwagger(app); // exposes /api-docs

/* --------- Prometheus metrics endpoint --------- */
app.get("/metrics", metricsEndpoint);

/* --------- Start services and connect to DB --------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected");

    // Connect Kafka producer (non-blocking - if it fails, server still comes up)
    try {
      if (kafkaProducer && typeof kafkaProducer.connectProducer === "function") {
        await kafkaProducer.connectProducer();
      } else {
        console.warn("Kafka producer connect function not found. Skipping Kafka connection.");
      }
    } catch (kerr) {
      console.error("Kafka connect error (server will still start):", kerr);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
