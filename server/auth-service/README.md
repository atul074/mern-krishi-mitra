# Authentication Service

A dedicated microservice for handling user authentication in the Krishi Mitra platform.

## Features

- 🔐 User Registration & Login
- 🚪 Secure Logout with JWT cleanup
- 🔄 Password Reset functionality
- 🍪 HTTP-only cookie-based JWT authentication
- 📨 RabbitMQ event publishing for auth events
- 📊 Prometheus metrics monitoring
- 📚 Swagger API documentation
- ✅ Health check endpoint

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check-auth` - Check authentication status
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### System Routes
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics
- `GET /api-docs` - Swagger documentation

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/krishi-mitra-auth

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# RabbitMQ Configuration
RABBITMQ_URL=amqp://localhost:5672

# Client Configuration
CLIENT_URL=http://localhost:5173

# Service Identification
SERVICE_NAME=auth-service
```

## Installation & Usage

```bash
# Install dependencies
npm install

# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## RabbitMQ Events

The service publishes authentication events to RabbitMQ:

- `auth.user_registered` - New user registration
- `auth.user_login` - User login
- `auth.user_logout` - User logout
- `auth.password_reset_request` - Password reset requested
- `auth.password_reset_success` - Password reset completed

## Dependencies

- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **amqplib** - RabbitMQ messaging
- **Prometheus** - Metrics monitoring
- **Swagger** - API documentation

## Architecture

This service is part of the Krishi Mitra microservices architecture:
- Runs on port 5001
- Connects to API Gateway on port 3000
- Publishes events to RabbitMQ for other services
- Provides centralized authentication for the platform

## Migration from Kafka

This service was migrated from Kafka to RabbitMQ for improved messaging:
- ✅ Removed kafka-node and kafkajs dependencies
- ✅ Added amqplib for RabbitMQ
- ✅ Updated all event publishing to use RabbitMQ
- ✅ Added graceful shutdown handling
- ✅ Improved error handling for messaging failures
