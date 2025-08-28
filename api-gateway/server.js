const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Middleware imports
const { authenticateToken, requireAdmin, optionalAuth } = require('./middleware/auth');
const { generalLimiter, authLimiter, productLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler, healthCheck } = require('./middleware/errorHandler');

// Route imports
const { getAuthRequirement, getTargetService } = require('./routes/config');
const { 
  authServiceProxy, 
  productServiceProxy, 
  orderServiceProxy, 
  mainServerProxy,
  services 
} = require('./routes/proxy');

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// SECURITY & BASIC MIDDLEWARE
// ===============================

// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false // Disable for API gateway
}));

// Compression
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Expires',
    'Pragma',
    'x-user-id',
    'x-user-role',
    'x-user-email'
  ]
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
app.use(morgan('combined'));

// General rate limiting
app.use(generalLimiter);

// ===============================
// HEALTH CHECK
// ===============================
app.get('/health', healthCheck);

// Service status endpoint
app.get('/api/gateway/status', (req, res) => {
  res.json({
    success: true,
    message: 'API Gateway is running',
    services,
    timestamp: new Date().toISOString()
  });
});

// ===============================
// AUTHENTICATION MIDDLEWARE
// ===============================

// Dynamic authentication middleware
const dynamicAuth = (req, res, next) => {
  const authRequirement = getAuthRequirement(req.method, req.path);
  
  console.log(`Route: ${req.method} ${req.path} - Auth: ${authRequirement}`);
  
  switch (authRequirement) {
    case 'none':
      // Public route, no authentication needed
      next();
      break;
      
    case 'admin':
      // Admin authentication required
      authenticateToken(req, res, (authErr) => {
        if (authErr) return;
        requireAdmin(req, res, next);
      });
      break;
      
    case 'user':
      // User authentication required
      authenticateToken(req, res, next);
      break;
      
    default:
      // Default to user authentication
      authenticateToken(req, res, next);
  }
};

// ===============================
// ROUTE-SPECIFIC RATE LIMITING
// ===============================

// Auth routes get stricter rate limiting
app.use('/api/auth', authLimiter);

// Product routes get more lenient rate limiting
app.use('/api/products', productLimiter);
app.use('/api/shop/products', productLimiter);

// ===============================
// PROXY ROUTING
// ===============================

// Apply dynamic authentication to all API routes
app.use('/api', dynamicAuth);

// Auth Service Routes
app.use('/api/auth', authServiceProxy);

// Product Service Routes  
app.use('/api/products', productServiceProxy);
app.use('/api/cart', productServiceProxy);

// Order Service Routes
app.use('/api/orders', orderServiceProxy);

// Main Server Routes (Chat, Shop & Admin)
app.use('/api/chat', mainServerProxy);
app.use('/api/shop', mainServerProxy);
app.use('/api/admin', mainServerProxy);

// ===============================
// ERROR HANDLING
// ===============================

// 404 handler
app.use('*', notFoundHandler);

// Global error handler
app.use(errorHandler);

// ===============================
// SERVER STARTUP
// ===============================

const server = app.listen(PORT, () => {
  console.log(`
🚀 API Gateway started successfully!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}

📋 Microservices:
  🔐 Auth: ${services.auth}
  📦 Product: ${services.product}
  🛒 Order: ${services.order}
  💬 Main/Chat/Admin: ${services.main}

📊 Endpoints:
  ❤️  Health: http://localhost:${PORT}/health
  📈 Status: http://localhost:${PORT}/api/gateway/status
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

module.exports = app;
