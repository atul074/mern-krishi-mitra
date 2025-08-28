# API Gateway for Krishi Mitra

## Overview
This API Gateway serves as the central entry point for all client requests to the Krishi Mitra microservices architecture. It handles authentication, rate limiting, request routing, and provides a unified API interface.

## Architecture

```
Client Application (Port 5173)
        ↓
API Gateway (Port 3000)
        ↓
┌─────────────────────────────────────────┐
│              Microservices              │
├─────────────────────────────────────────┤
│ Auth/Admin Service (Port 5001)          │
│ Product Service (Port 5002)             │
│ Order Service (Port 5003)               │
│ Main Server - Chat/Legacy (Port 5000)   │
└─────────────────────────────────────────┘
```

## Features

### 🔐 Authentication & Authorization
- **JWT Token Validation**: Centralized authentication using JSON Web Tokens
- **Role-based Access Control**: Different access levels for users and admins
- **Dynamic Authentication**: Routes automatically determine auth requirements
- **Optional Authentication**: Some routes work with or without authentication

### 🛡️ Security
- **Helmet**: Security headers for protection against common vulnerabilities
- **CORS**: Configured for secure cross-origin requests
- **Rate Limiting**: Multiple rate limiting strategies
  - General: 100 requests per 15 minutes
  - Auth routes: 5 requests per 15 minutes
  - Product routes: 50 requests per minute

### 🔄 Request Routing
- **Intelligent Routing**: Automatic routing based on URL patterns
- **Service Discovery**: Dynamic service URL configuration
- **Load Balancing Ready**: Prepared for horizontal scaling
- **Health Checks**: Monitor service availability

### 📊 Monitoring & Logging
- **Request Logging**: Comprehensive request/response logging
- **Error Handling**: Centralized error management
- **Health Endpoints**: Service status monitoring
- **Performance Metrics**: Ready for monitoring integration

## Route Configuration

### Public Routes (No Authentication)
- Authentication endpoints (`/api/auth/*`)
- Product browsing (`/api/products/*`, `/api/shop/products/*`)
- Search functionality (`/api/shop/search`)
- Health checks (`/health`)

### User Authentication Required
- Shopping cart operations (`/api/shop/cart/*`)
- Address management (`/api/shop/address/*`)
- Order management (`/api/shop/order/*`)
- Product reviews (`/api/shop/review/*`)
- Chat functionality (`/api/chat/*`)

### Admin Authentication Required
- Product management (`/api/admin/products/*`)
- Order administration (`/api/admin/orders/*`)
- User management (`/api/admin/users/*`)
- Admin chat panel (`/api/chat/users`)

## Service Routing

| Route Pattern | Target Service | Purpose |
|---------------|----------------|---------|
| `/api/auth/*` | Auth/Admin Service | Authentication & authorization |
| `/api/admin/*` | Auth/Admin Service | Admin operations |
| `/api/products/*` | Product Service | Product catalog |
| `/api/cart/*` | Product Service | Shopping cart |
| `/api/orders/*` | Order Service | Order processing |
| `/api/chat/*` | Main Server | Real-time chat |
| `/api/shop/*` | Main Server | Legacy shop routes |

## Installation & Setup

1. **Install dependencies**:
```bash
cd api-gateway
npm install
```

2. **Configure environment**:
Copy `.env` file and update the following variables:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
AUTH_ADMIN_SERVICE_URL=http://localhost:5001
PRODUCT_SERVICE_URL=http://localhost:5002
ORDER_SERVICE_URL=http://localhost:5003
MAIN_SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

3. **Start the gateway**:
```bash
# Development
npm run dev

# Production
npm start
```

## Usage

### Starting All Services

1. **Start microservices** (in separate terminals):
```bash
# Auth/Admin Service
cd server/auth-admin-service
npm run dev

# Product Service  
cd server/product-service
npm run dev

# Order Service
cd server/order-service  
npm run dev

# Main Server (Chat/Legacy)
cd server
npm run dev
```

2. **Start API Gateway**:
```bash
cd api-gateway
npm run dev
```

3. **Start Frontend**:
```bash
cd client/vite-project
npm run dev
```

### Health Monitoring

Check gateway status:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/gateway/status
```

## Error Handling

The gateway provides comprehensive error handling:

- **Service Unavailable (503)**: When microservices are down
- **Authentication Errors (401/403)**: Invalid or expired tokens
- **Rate Limiting (429)**: Too many requests
- **Not Found (404)**: Unknown routes
- **Validation Errors (400)**: Request validation failures

## Security Features

### Rate Limiting
- **General routes**: 100 requests per 15 minutes per IP
- **Authentication routes**: 5 requests per 15 minutes per IP  
- **Product browsing**: 50 requests per minute per IP

### Headers & CORS
- Security headers via Helmet
- CORS configured for client application
- Request size limits (10MB)
- Cookie parsing for authentication

### Authentication Flow
1. Client sends request with JWT token (cookie or header)
2. Gateway validates token and extracts user info
3. User information forwarded to microservices via headers
4. Microservices can trust the authentication

## Development Guidelines

### Adding New Routes
1. Update `routes/config.js` with route patterns
2. Specify authentication requirements
3. Add service routing if needed
4. Test with appropriate authentication

### Adding New Services
1. Add service URL to `.env`
2. Create proxy configuration in `routes/proxy.js`
3. Update service routing in `routes/config.js`
4. Add health check integration

### Monitoring Integration
The gateway is prepared for monitoring tools:
- Structured logging
- Error tracking
- Performance metrics
- Health endpoints

## Production Considerations

- **Environment Variables**: Secure JWT secrets and service URLs
- **SSL/TLS**: Use HTTPS in production
- **Load Balancing**: Consider multiple gateway instances
- **Monitoring**: Integrate with APM tools
- **Caching**: Consider Redis for token validation
- **Service Discovery**: Implement dynamic service registration
