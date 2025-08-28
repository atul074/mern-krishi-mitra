const client = require("prom-client");

// Registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Metrics
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5]
});

register.registerMetric(httpRequestDuration);

// Middleware
const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    end({ method: req.method, route: req.originalUrl, status_code: res.statusCode });
  });
  next();
};

module.exports = { metricsMiddleware, register, httpRequestDuration };
