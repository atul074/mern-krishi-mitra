const express = require('express');
const router = express.Router();

// Route definitions with their authentication requirements
const routeConfig = {
  // Public routes (no authentication required)
  public: [
    'GET /api/auth/check-auth',
    'POST /api/auth/register',
    'POST /api/auth/login',
    'POST /api/auth/logout',
    'GET /api/products',
    'GET /api/products/:id',
    'GET /api/shop/products',
    'GET /api/shop/products/:id',
    'GET /api/shop/search',
    'GET /health'
  ],

  // User authentication required
  userAuth: [
    'GET /api/shop/cart',
    'POST /api/shop/cart/add',
    'PUT /api/shop/cart/update-cart',
    'DELETE /api/shop/cart/:userId/:productId',
    'GET /api/shop/address/:userId',
    'POST /api/shop/address/add',
    'PUT /api/shop/address/update/:userId/:addressId',
    'DELETE /api/shop/address/delete/:userId/:addressId',
    'POST /api/shop/order/create',
    'POST /api/shop/order/capture',
    'GET /api/shop/order/list/:userId',
    'GET /api/shop/order/details/:id',
    'POST /api/shop/review/add',
    'GET /api/shop/review/:productId',
    'GET /api/chat/messages/:userId',
    'POST /api/chat/send'
  ],

  // Admin authentication required
  adminAuth: [
    'GET /api/admin/products/get',
    'POST /api/admin/products/add',
    'PUT /api/admin/products/edit/:id',
    'DELETE /api/admin/products/delete/:id',
    'POST /api/admin/products/upload-image',
    'GET /api/admin/orders/get',
    'GET /api/admin/orders/details/:id',
    'PUT /api/admin/orders/update/:id',
    'GET /api/admin/users/get',
    'DELETE /api/admin/users/delete/:id',
    'GET /api/chat/users',
    'GET /api/chat/messages/:userId'
  ]
};

// Helper function to check if route matches pattern
const matchesRoute = (method, path, pattern) => {
  const [patternMethod, patternPath] = pattern.split(' ');
  
  if (method !== patternMethod) return false;
  
  // Convert path pattern to regex
  const regexPath = patternPath
    .replace(/:[^\/]+/g, '[^/]+') // Replace :param with regex
    .replace(/\//g, '\\/'); // Escape forward slashes
  
  const regex = new RegExp(`^${regexPath}$`);
  return regex.test(path);
};

// Determine authentication requirement for a route
const getAuthRequirement = (method, path) => {
  const route = `${method} ${path}`;
  
  // Check if it's a public route
  if (routeConfig.public.some(pattern => matchesRoute(method, path, pattern))) {
    return 'none';
  }
  
  // Check if it's an admin route
  if (routeConfig.adminAuth.some(pattern => matchesRoute(method, path, pattern))) {
    return 'admin';
  }
  
  // Check if it's a user route
  if (routeConfig.userAuth.some(pattern => matchesRoute(method, path, pattern))) {
    return 'user';
  }
  
  // Default to user auth for unknown routes
  return 'user';
};

// Service routing configuration
const serviceRoutes = {
  // Auth Service
  auth: [
    '/api/auth'
  ],
  
  // Product Service
  product: [
    '/api/products',
    '/api/cart'
  ],
  
  // Order Service  
  order: [
    '/api/orders'
  ],
  
  // Main Server (chat and shop routes)
  main: [
    '/api/chat',
    '/api/shop',
    '/api/admin'
  ]
};

// Determine which service should handle the route
const getTargetService = (path) => {
  for (const [service, routes] of Object.entries(serviceRoutes)) {
    if (routes.some(route => path.startsWith(route))) {
      return service;
    }
  }
  return 'main'; // Default to main server
};

module.exports = {
  routeConfig,
  getAuthRequirement,
  getTargetService,
  matchesRoute
};
