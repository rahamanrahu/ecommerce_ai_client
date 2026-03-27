/**
 * Input Validation Middleware
 * Uses express-validator for request validation
 */

const { body, param, validationResult } = require('express-validator');
const { sendError, HTTP_STATUS } = require('../utils/responseUtils');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            field: error.path,
            message: error.msg
        }));

        return sendError(
            res,
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            'Validation failed',
            formattedErrors
        );
    }

    next();
};

/**
 * User registration validation rules
 */
const validateRegister = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    handleValidationErrors
];

/**
 * User login validation rules
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

/**
 * Product creation/update validation rules
 */
const validateProduct = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    
    handleValidationErrors
];

/**
 * Cart item validation rules
 */
const validateCartItem = [
    body('productId')
        .trim()
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID format'),
    
    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    
    handleValidationErrors
];

/**
 * Order creation validation rules
 */
const validateOrder = [
    body('shippingAddress')
        .notEmpty()
        .withMessage('Shipping address is required')
        .isObject()
        .withMessage('Shipping address must be an object'),
    
    body('shippingAddress.street')
        .trim()
        .notEmpty()
        .withMessage('Street address is required'),
    
    body('shippingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    
    body('shippingAddress.state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),
    
    body('shippingAddress.zipCode')
        .trim()
        .notEmpty()
        .withMessage('Zip code is required'),
    
    body('shippingAddress.country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),
    
    handleValidationErrors
];

/**
 * MongoDB ID parameter validation
 */
const validateMongoId = (paramName = 'id') => [
    param(paramName)
        .isMongoId()
        .withMessage(`Invalid ${paramName} format`),
    
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateProduct,
    validateCartItem,
    validateOrder,
    validateMongoId,
    handleValidationErrors
};
