/**
 * Cart Controller
 * Handles shopping cart operations
 */

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendSuccess, sendError, HTTP_STATUS } = require('../utils/responseUtils');

/**
 * Get user's cart
 * GET /api/cart
 */
const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await Cart.findOrCreate(userId);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Cart retrieved successfully',
            { cart }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error retrieving cart',
            error.message
        );
    }
};

/**
 * Add item to cart
 * POST /api/cart/add
 */
const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity = 1 } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);

        if (!product) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Product not found'
            );
        }

        // Check if product is active
        if (!product.isActive) {
            return sendError(
                res,
                HTTP_STATUS.BAD_REQUEST,
                'Product is not available'
            );
        }

        // Check stock availability
        if (product.stock < quantity) {
            return sendError(
                res,
                HTTP_STATUS.BAD_REQUEST,
                `Only ${product.stock} items available in stock`
            );
        }

        // Get or create cart
        const cart = await Cart.findOrCreate(userId);

        // Add item to cart
        await cart.addItem(productId, quantity, product.price);

        // Re-fetch cart with populated products
        const updatedCart = await Cart.findOne({ user: userId })
            .populate('items.product');

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Item added to cart successfully',
            { cart: updatedCart }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error adding item to cart',
            error.message
        );
    }
};

/**
 * Remove item from cart
 * DELETE /api/cart/remove/:productId
 */
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Cart not found'
            );
        }

        // Check if item exists in cart
        const itemExists = cart.items.some(
            item => item.product.toString() === productId
        );

        if (!itemExists) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Item not found in cart'
            );
        }

        // Remove item
        await cart.removeItem(productId);

        // Re-fetch cart with populated products
        const updatedCart = await Cart.findOne({ user: userId })
            .populate('items.product');

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Item removed from cart successfully',
            { cart: updatedCart }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error removing item from cart',
            error.message
        );
    }
};

/**
 * Update item quantity in cart
 * PUT /api/cart/update/:productId
 */
const updateQuantity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return sendError(
                res,
                HTTP_STATUS.BAD_REQUEST,
                'Quantity must be at least 1'
            );
        }

        // Check product stock
        const product = await Product.findById(productId);

        if (!product) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Product not found'
            );
        }

        if (product.stock < quantity) {
            return sendError(
                res,
                HTTP_STATUS.BAD_REQUEST,
                `Only ${product.stock} items available in stock`
            );
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Cart not found'
            );
        }

        // Update quantity
        await cart.updateQuantity(productId, quantity);

        // Re-fetch cart with populated products
        const updatedCart = await Cart.findOne({ user: userId })
            .populate('items.product');

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Cart updated successfully',
            { cart: updatedCart }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error updating cart',
            error.message
        );
    }
};

/**
 * Clear cart
 * DELETE /api/cart/clear
 */
const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Cart not found'
            );
        }

        await cart.clear();

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Cart cleared successfully',
            { cart }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error clearing cart',
            error.message
        );
    }
};

/**
 * Sync cart (for merging guest cart with user cart)
 * POST /api/cart/sync
 */
const syncCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { items } = req.body; // Array of { productId, quantity }

        if (!Array.isArray(items) || items.length === 0) {
            return sendError(
                res,
                HTTP_STATUS.BAD_REQUEST,
                'Items array is required'
            );
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Process each item
        for (const item of items) {
            const { productId, quantity } = item;

            const product = await Product.findById(productId);

            if (product && product.isActive && product.stock >= quantity) {
                const existingItemIndex = cart.items.findIndex(
                    cartItem => cartItem.product.toString() === productId
                );

                if (existingItemIndex >= 0) {
                    // Update quantity if item exists
                    cart.items[existingItemIndex].quantity = quantity;
                } else {
                    // Add new item
                    cart.items.push({
                        product: productId,
                        quantity,
                        price: product.price
                    });
                }
            }
        }

        await cart.save();

        // Re-fetch cart with populated products
        const updatedCart = await Cart.findOne({ user: userId })
            .populate('items.product');

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Cart synced successfully',
            { cart: updatedCart }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error syncing cart',
            error.message
        );
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart
};
