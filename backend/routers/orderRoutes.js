/**
 * Order Routes
 * Handles order management operations
 */

const express = require('express');
const router = express.Router();

const {
    createOrder,
    getOrderHistory,
    getOrderById,
    cancelOrder,
    getOrderStats
} = require('../controllers/orderController');

const { authenticate } = require('../middleware/auth');
const { validateOrder, validateMongoId } = require('../middleware/validate');

// All order routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/orders
 * @desc    Create new order from cart
 * @access  Private
 */
router.post('/', validateOrder, createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get user's order history
 * @access  Private
 */
router.get('/', getOrderHistory);

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics for user
 * @access  Private
 */
router.get('/stats', getOrderStats);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by ID
 * @access  Private
 */
router.get('/:id', validateMongoId('id'), getOrderById);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel an order
 * @access  Private
 */
router.put('/:id/cancel', validateMongoId('id'), cancelOrder);

module.exports = router;
