/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

const { sendError, HTTP_STATUS } = require('../utils/responseUtils');

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, statusCode, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    // Default error values
    let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || null;

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
        message = 'Validation Error';
        errors = Object.values(err.errors).map(val => val.message);
    }

    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
        statusCode = HTTP_STATUS.CONFLICT;
        message = 'Duplicate field value entered';
        const field = Object.keys(err.keyValue)[0];
        errors = { [field]: `${field} already exists` };
    }

    // Handle Mongoose cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = 'Token expired';
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    return sendError(res, statusCode, message, errors);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    return sendError(
        res,
        HTTP_STATUS.NOT_FOUND,
        `Route ${req.originalUrl} not found`
    );
};

/**
 * Async handler wrapper
 * Eliminates need for try-catch in async route handlers
 * @param {Function} fn - Async route handler function
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    APIError,
    errorHandler,
    notFoundHandler,
    asyncHandler
};
