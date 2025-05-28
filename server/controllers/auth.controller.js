// D:\First-Intern-OS\server\controllers\auth.controller.js
const User = require('../models/user.model');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const ErrorResponse = require('../utils/errorResponse.util');

// Helper to send token response
const sendTokenResponse = (user, statusCode, res, message) => {
    const token = user.getSignedJwtToken(); // Method defined on User model

    // For Bearer token in JSON response (client stores in localStorage)
    res.status(statusCode).json({
        success: true,
        token,
        user: { // Send back essential, non-sensitive user details
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        },
        message
    });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body; // Role can be optionally passed for admin creation

    if (!name || !email || !password) {
        return next(new ErrorResponse('Please provide name, email, and password', 400));
    }
    if (password.length < 6) {
        return next(new ErrorResponse('Password must be at least 6 characters long', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorResponse('User with this email already exists', 400));
    }

    // Create user (role defaults to 'student' in model if not provided or invalid)
    const user = await User.create({
        name,
        email,
        password,
        role: role && ['admin', 'student'].includes(role) ? role : 'student'
    });

    sendTokenResponse(user, 201, res, 'User registered successfully');
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password'); // Need to explicitly select password
    if (!user) {
        return next(new ErrorResponse('Invalid credentials (user not found)', 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials (password incorrect)', 401));
    }

    sendTokenResponse(user, 200, res, 'Login successful');
});

// @desc    Get current logged-in user details
// @route   GET /api/v1/auth/me
// @access  Private (requires token)
exports.getMe = asyncHandler(async (req, res, next) => {
    // req.user is populated by the 'protect' middleware and password is already excluded
    res.status(200).json({ success: true, data: req.user });
});

// @desc    Log user out (client handles token removal)
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    // For stateless JWT, logout is primarily a client-side action (clearing the token).
    // If using session cookies or server-side token blacklisting, add logic here.
    res.status(200).json({ success: true, message: 'Logout successful. Client should clear token.' });
});