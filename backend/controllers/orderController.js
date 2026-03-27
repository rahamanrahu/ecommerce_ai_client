/**
 * Order Controller
 * Handles order creation and management
 */

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendSuccess, sendError, HTTP_STATUS } = require('../utils/responseUtils');

/**
 * Create new order from cart
 * POST /api/orders
 */
const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { shippingAddress, paymentMethod = 'credit_card', notes } = req.body;

        // Get user's cart with populated products
        const cart = await Cart.findOne({ user: userId })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            return sendError(
                res,
                HTTP_STATUS.BAD_REQUEST,
                'Cart is empty'
            );
        }

        // Validate stock availability for all items
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);

            if (!product) {
                return sendError(
                    res,
                    HTTP_STATUS.BAD_REQUEST,
                    `Product not found: ${item.product.name}`
                );
            }

            if (product.stock < item.quantity) {
                return sendError(
                    res,
                    HTTP_STATUS.BAD_REQUEST,
                    `Insufficient stock for ${product.name}. Available: ${product.stock}`
                );
            }
        }

        // Prepare order items
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            image: item.product.images && item.product.images[0]
        }));

        // Calculate totals
        const subtotal = cart.total;
        const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shippingCost + tax;

        // Create order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            subtotal,
            shippingCost,
            tax,
            total,
            paymentMethod,
            notes,
            paymentStatus: 'completed' // For demo purposes
        });

        // Decrease product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Clear the cart
        await cart.clear();

        // Populate order with product details
        const populatedOrder = await Order.findById(order._id)
            .populate('items.product', 'name images');

        return sendSuccess(
            res,
            HTTP_STATUS.CREATED,
            'Order created successfully',
            { order: populatedOrder }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error creating order',
            error.message
        );
    }
};

/**
 * Get user's order history
 * GET /api/orders
 */
const getOrderHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 10 } = req.query;

        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit)
        };

        const orders = await Order.getUserOrders(userId, options);

        const total = await Order.countDocuments({ user: userId });

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Order history retrieved successfully',
            {
                orders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error retrieving order history',
            error.message
        );
    }
};

/**
 * Get single order by ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user: userId
        }).populate('items.product', 'name images');

        if (!order) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Order not found'
            );
        }

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Order retrieved successfully',
            { order }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error retrieving order',
            error.message
        );
    }
};

/**
 * Cancel order
 * PUT /api/orders/:id/cancel
 */
const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user: userId
        });

        if (!order) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Order not found'
            );
        }

        // Only allow cancellation of pending or processing orders
        if (!['pending', 'processing'].includes(order.status)) {
            return sendError(
                res,
                HTTP_STATUS.BAD_REQUEST,
                `Cannot cancel order with status: ${order.status}`
            );
        }

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } }
            );
        }

        // Update order status
        order.status = 'cancelled';
        order.paymentStatus = 'refunded';
        await order.save();

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Order cancelled successfully',
            { order }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error cancelling order',
            error.message
        );
    }
};

/**
 * Get order statistics for user
 * GET /api/orders/stats
 */
const getOrderStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const stats = await Order.getOrderStats(userId);

        // Get additional stats
        const statusCounts = await Order.aggregate([
            { $match: { user: new require('mongoose').Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = stats[0] || {
            totalOrders: 0,
            totalSpent: 0,
            averageOrderValue: 0
        };

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Order statistics retrieved successfully',
            {
                stats: {
                    ...formattedStats,
                    statusBreakdown: statusCounts
                }
            }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error retrieving order statistics',
            error.message
        );
    }
};

module.exports = {
    createOrder,
    getOrderHistory,
    getOrderById,
    cancelOrder,
    getOrderStats
};
