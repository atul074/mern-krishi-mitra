// prometheus/metrics.js
import client from "prom-client";

// default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ timeout: 5000 });

// HTTP metrics: histogram to observe durations, and counter for total requests
const httpRequestDurationMs = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 200, 300, 500, 1000, 2000]
});

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"]
});

// Middleware to measure request duration and count
const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDurationMs.startTimer();
  res.on("finish", () => {
    const route = req.route && req.route.path ? req.baseUrl + req.route.path : req.originalUrl;
    httpRequestCounter.inc({ method: req.method, route, status_code: res.statusCode });
    end({ method: req.method, route, status_code: res.statusCode });
  });
  next();
};

const metricsEndpoint = async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (e) {
    res.status(500).end(e.message);
  }
};

export { metricsMiddleware, metricsEndpoint, client };
