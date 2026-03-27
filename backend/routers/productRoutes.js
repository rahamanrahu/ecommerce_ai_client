/**
 * Product Routes
 * Handles product CRUD operations
 */

const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getFeaturedProducts
} = require('../controllers/productController');

const { validateProduct, validateMongoId } = require('../middleware/validate');

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filtering
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', getFeaturedProducts);

/**
 * @route   GET /api/products/category/:category
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:category', getProductsByCategory);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', validateMongoId('id'), getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public (should be protected for admin in production)
 */
router.post('/', validateProduct, createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Public (should be protected for admin in production)
 */
router.put('/:id', validateMongoId('id'), validateProduct, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Public (should be protected for admin in production)
 */
router.delete('/:id', validateMongoId('id'), deleteProduct);

module.exports = router;
