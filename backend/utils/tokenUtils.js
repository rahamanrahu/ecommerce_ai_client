/**
 * JWT Token Utility Functions
 * Handles token generation and verification
 */

const jwt = require('jsonwebtoken');
const config = require('../env/config');

/**
 * Generate JWT token for a user
 * @param {Object} payload - Token payload (user data)
 * @param {string} payload.userId - User ID
 * @param {string} payload.email - User email
 * @returns {string} - JWT token
 */
const generateToken = (payload) => {
    try {
        const token = jwt.sign(
            payload,
            config.jwt.secret,
            { expiresIn: config.jwt.expire }
        );
        return token;
    } catch (error) {
        throw new Error(`Error generating token: ${error.message}`);
    }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw new Error(`Token verification error: ${error.message}`);
        }
    }
};

module.exports = {
    generateToken,
    verifyToken
};
