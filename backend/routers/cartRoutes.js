/**
 * Cart Routes
 * Handles shopping cart operations
 */

const express = require('express');
const router = express.Router();

const {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart
} = require('../controllers/cartController');

const { authenticate } = require('../middleware/auth');
const { validateCartItem, validateMongoId } = require('../middleware/validate');

// All cart routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get('/', getCart);

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/add', validateCartItem, addToCart);

/**
 * @route   PUT /api/cart/update/:productId
 * @desc    Update item quantity in cart
 * @access  Private
 */
router.put('/update/:productId', validateMongoId('productId'), updateQuantity);

/**
 * @route   DELETE /api/cart/remove/:productId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/remove/:productId', validateMongoId('productId'), removeFromCart);

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete('/clear', clearCart);

/**
 * @route   POST /api/cart/sync
 * @desc    Sync cart items (for merging guest cart)
 * @access  Private
 */
router.post('/sync', syncCart);

module.exports = router;
