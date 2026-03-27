/**
 * Router Index
 * Aggregates all route modules
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');

/**
 * Mount all routes with /api prefix
 */

// Authentication routes - /api/auth
router.use('/auth', authRoutes);

// Product routes - /api/products
router.use('/products', productRoutes);

// Cart routes - /api/cart
router.use('/cart', cartRoutes);

// Order routes - /api/orders
router.use('/orders', orderRoutes);

/**
 * API Health Check
 * GET /api/health
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

module.exports = router;
