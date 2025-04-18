const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/User');
const { verifyToken, verifyRefreshToken } = require('../middleware/auth');
const { sendResponse, sendError } = require('../utils/response');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// Helper function to generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    const refreshToken = jwt.sign(
        { userId: user._id },
        REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
};

// Register endpoint
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, 'Email already registered', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token
        user.refreshTokens.push({
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
        await user.save();

        sendResponse(res, {
            user: user.toJSON(),
            accessToken,
            refreshToken
        }, 201);
    } catch (error) {
        console.error('Registration error:', error);
        sendError(res, 'Error registering user');
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 'Invalid credentials', 401);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendError(res, 'Invalid credentials', 401);
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Update last login and save refresh token
        user.lastLogin = new Date();
        user.refreshTokens.push({
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        await user.save();

        sendResponse(res, {
            user: user.toJSON(),
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Login error:', error);
        sendError(res, 'Error during login');
    }
});

// Refresh token endpoint
router.post("/refresh-token", verifyRefreshToken, async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const user = req.user;

        // Remove the used refresh token
        user.refreshTokens = user.refreshTokens.filter(
            token => token.token !== refreshToken
        );

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        // Save new refresh token
        user.refreshTokens.push({
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        await user.save();

        sendResponse(res, {
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        sendError(res, 'Error refreshing token');
    }
});

// Logout endpoint
router.post("/logout", verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];

        // Remove the current refresh token
        user.refreshTokens = user.refreshTokens.filter(
            refreshToken => refreshToken.token !== token
        );
        await user.save();

        sendResponse(res, { message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        sendError(res, 'Error during logout');
    }
});

module.exports = router; 