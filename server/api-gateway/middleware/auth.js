const jwt = require('jsonwebtoken');

// Authentication middleware for protected routes
const authenticateToken = (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies?.token || 
                  req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is missing'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // Add user info to headers for downstream services
    req.headers['x-user-id'] = decoded.id;
    req.headers['x-user-role'] = decoded.role;
    req.headers['x-user-email'] = decoded.email;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Admin role validation middleware
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token || 
                  req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      req.headers['x-user-id'] = decoded.id;
      req.headers['x-user-role'] = decoded.role;
      req.headers['x-user-email'] = decoded.email;
    }
  } catch (error) {
    // Continue without authentication for optional routes
    console.log('Optional auth failed, continuing without auth');
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};
