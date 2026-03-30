/**
 * Product Controller
 * Handles product CRUD operations
 */

const Product = require('../models/Product');
const { sendSuccess, sendError, HTTP_STATUS } = require('../utils/responseUtils');

/**
 * Get all products
 * GET /api/products
 */
const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt',
            category,
            minPrice,
            maxPrice,
            search,
            isActive = true
        } = req.query;

        // Build filter object
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true' || isActive === true;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        if (search) {
            filter.$text = { $search: search };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await Product.countDocuments(filter);

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Products retrieved successfully',
            {
                products,
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
            'Error retrieving products',
            error.message
        );
    }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Product not found'
            );
        }

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Product retrieved successfully',
            { product }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error retrieving product',
            error.message
        );
    }
};

/**
 * Create new product
 * POST /api/products
 */
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            compareAtPrice,
            stock,
            category,
            subcategory,
            images,
            sku,
            tags,
            attributes,
            isActive,
            isFeatured
        } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            compareAtPrice,
            stock,
            category,
            subcategory,
            images,
            sku,
            tags,
            attributes,
            isActive,
            isFeatured
        });

        return sendSuccess(
            res,
            HTTP_STATUS.CREATED,
            'Product created successfully',
            { product }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error creating product',
            error.message
        );
    }
};

/**
 * Update product
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData._id;
        delete updateData.createdAt;

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Product not found'
            );
        }

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Product updated successfully',
            { product }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error updating product',
            error.message
        );
    }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'Product not found'
            );
        }

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Product deleted successfully'
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error deleting product',
            error.message
        );
    }
};

/**
 * Get products by category
 * GET /api/products/category/:category
 */
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find({
            category,
            isActive: true
        })
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments({
            category,
            isActive: true
        });

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Products retrieved successfully',
            {
                products,
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
            'Error retrieving products',
            error.message
        );
    }
};

/**
 * Get featured products
 * GET /api/products/featured
 */
const getFeaturedProducts = async (req, res) => {
    try {
        const { limit = 8 } = req.query;

        const products = await Product.find({
            isFeatured: true,
            isActive: true
        })
            .sort('-createdAt')
            .limit(parseInt(limit));

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Featured products retrieved successfully',
            { products }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error retrieving featured products',
            error.message
        );
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getFeaturedProducts
};
