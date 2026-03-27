/**
 * E-commerce Backend API Server
 * Main entry point for the application
 */

const express = require('express');
const cors = require('cors');
const config = require('./env/config');
const { connectDB } = require('./db/connection');
const routes = require('./routers');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

/**
 * Middleware Setup
 */

// CORS configuration
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logging Middleware (Development)
 */
if (config.server.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

/**
 * API Routes
 * All routes prefixed with /api
 */
app.use('/api', routes);

/**
 * Root Endpoint
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to E-commerce API',
        version: '1.0.0',
        documentation: '/api/health',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            cart: '/api/cart',
            orders: '/api/orders'
        }
    });
});

/**
 * Error Handling
 */

// 404 Not Found handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

/**
 * Server Initialization
 */
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start server
        const PORT = config.server.port;
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log('E-commerce API Server');
            console.log('='.repeat(50));
            console.log(`Environment: ${config.server.nodeEnv}`);
            console.log(`Server running on port: ${PORT}`);
            console.log(`API Base URL: http://localhost:${PORT}/api`);
            console.log(`Health Check: http://localhost:${PORT}/api/health`);
            console.log('='.repeat(50));
            console.log('Available Endpoints:');
            console.log('  POST /api/auth/register - User registration');
            console.log('  POST /api/auth/login    - User login');
            console.log('  GET  /api/auth/profile  - Get user profile');
            console.log('  GET  /api/products      - List products');
            console.log('  GET  /api/cart          - Get cart');
            console.log('  POST /api/cart/add      - Add to cart');
            console.log('  POST /api/orders        - Create order');
            console.log('  GET  /api/orders        - Order history');
            console.log('='.repeat(50));
            console.log('Sample Login Credentials:');
            console.log('  Email: demo@example.com');
            console.log('  Password: Demo@123');
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    process.exit(1);
});

// Start the server
startServer();

module.exports = app;
