const { createProxyMiddleware } = require('http-proxy-middleware');

// Service URLs from environment
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:5003',
  main: process.env.MAIN_SERVER_URL || 'http://localhost:5000'
};

// Proxy configuration options
const defaultProxyOptions = {
  changeOrigin: true,
  timeout: 30000,
  proxyTimeout: 30000,
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('Proxy Error:', err.message);
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log the proxy request
    console.log(`Proxying ${req.method} ${req.originalUrl} to ${proxyReq.path}`);
    
    // Ensure body is forwarded for POST/PUT requests
    if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
};

// Auth Service Proxy
const authServiceProxy = createProxyMiddleware({
  target: services.auth,
  pathRewrite: {
    '^/api/auth': '/api/auth'
  },
  ...defaultProxyOptions
});

// Product Service Proxy
const productServiceProxy = createProxyMiddleware({
  target: services.product,
  pathRewrite: {
    '^/api/products': '/api/products',
    '^/api/cart': '/api/cart'
  },
  ...defaultProxyOptions
});

// Order Service Proxy
const orderServiceProxy = createProxyMiddleware({
  target: services.order,
  pathRewrite: {
    '^/api/orders': '/api/orders'
  },
  ...defaultProxyOptions
});

// Main Server Proxy (for chat and legacy routes)
const mainServerProxy = createProxyMiddleware({
  target: services.main,
  pathRewrite: {
    '^/api/chat': '/api/chat',
    '^/api/shop': '/api/shop'
  },
  ...defaultProxyOptions
});

module.exports = {
  authServiceProxy,
  productServiceProxy,
  orderServiceProxy,
  mainServerProxy,
  services
};
