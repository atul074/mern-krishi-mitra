const client = require("prom-client");

// Use the global registry
const register = client.register;

// Collect default metrics only once
if (!register.getSingleMetric("process_cpu_user_seconds_total")) {
  client.collectDefaultMetrics({ register });
}

// Check if metrics already exist
let httpRequestDuration = register.getSingleMetric("http_request_duration_seconds");
if (!httpRequestDuration) {
  httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
  });
}

let httpRequestCount = register.getSingleMetric("http_request_count");
if (!httpRequestCount) {
  httpRequestCount = new client.Counter({
    name: "http_request_count",
    help: "Total HTTP requests",
    labelNames: ["method", "route", "status_code"],
  });
}

const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: req.route?.path || req.originalUrl,
      status_code: res.statusCode,
    };
    httpRequestCount.inc(labels);
    end(labels);
  });
  next();
};

module.exports = { register, metricsMiddleware };
