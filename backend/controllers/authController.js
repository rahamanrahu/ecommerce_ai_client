/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const { sendSuccess, sendError, HTTP_STATUS } = require('../utils/responseUtils');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(
                res,
                HTTP_STATUS.CONFLICT,
                'User with this email already exists'
            );
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            email: user.email,
            role: user.role
        });

        return sendSuccess(
            res,
            HTTP_STATUS.CREATED,
            'User registered successfully',
            {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error registering user',
            error.message
        );
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with password
        const user = await User.findByEmail(email);

        if (!user) {
            return sendError(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Invalid email or password'
            );
        }

        // Check if user is active
        if (!user.isActive) {
            return sendError(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Account is deactivated. Please contact support.'
            );
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return sendError(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Invalid email or password'
            );
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            email: user.email,
            role: user.role
        });

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Login successful',
            {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error logging in',
            error.message
        );
    }
};

/**
 * Get user profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (!user) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'User not found'
            );
        }

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Profile retrieved successfully',
            { user }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error retrieving profile',
            error.message
        );
    }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, phone, address } = req.body;

        // Fields that can be updated
        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'User not found'
            );
        }

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Profile updated successfully',
            { user }
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error updating profile',
            error.message
        );
    }
};

/**
 * Change password
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        // Find user with password
        const user = await User.findById(userId).select('+password');

        if (!user) {
            return sendError(
                res,
                HTTP_STATUS.NOT_FOUND,
                'User not found'
            );
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);

        if (!isCurrentPasswordValid) {
            return sendError(
                res,
                HTTP_STATUS.UNAUTHORIZED,
                'Current password is incorrect'
            );
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Password changed successfully'
        );
    } catch (error) {
        return sendError(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Error changing password',
            error.message
        );
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};
