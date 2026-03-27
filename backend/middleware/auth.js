/**
 * Authentication Middleware
 * Verifies JWT tokens for protected routes
 */

const { verifyToken } = require('../utils/tokenUtils');
const { sendError, HTTP_STATUS } = require('../utils/responseUtils');

/**
 * Middleware to verify JWT token
 * Adds decoded user data to req.user
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Access denied. No token provided.'
            );
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        if (!token) {
            return sendError(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Access denied. Invalid token format.'
            );
        }

        // Verify token
        const decoded = verifyToken(token);

        // Add user data to request object
        req.user = decoded;

        next();
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.UNAUTHORIZED,
            error.message || 'Authentication failed'
        );
    }
};

/**
 * Optional authentication middleware
 * Adds user data if token exists, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);
            req.user = decoded;
        }

        next();
    } catch (error) {
        // Continue without user data if token is invalid
        next();
    }
};

module.exports = {
    authenticate,
    optionalAuth
};
