// D:\First-Intern-OS\server\middleware\auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Ensure correct path to User model
const asyncHandler = require('./asyncHandler.middleware'); // Utility for async functions
const ErrorResponse = require('../utils/errorResponse.util'); // Custom error class

// Middleware to protect routes by verifying JWT
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Else if using cookies:
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route (no token provided)', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
        // This case might happen if user was deleted after token was issued
        return next(new ErrorResponse('Not authorized (user for this token no longer exists)', 401));
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // This will catch JsonWebTokenError and TokenExpiredError as well
    return next(new ErrorResponse('Not authorized (token verification failed or token expired)', 401));
  }
});

// Middleware to authorize user based on roles
exports.authorize = (...roles) => { // Takes an array of allowed roles
  return (req, res, next) => {
    if (!req.user) { // Should ideally be caught by 'protect' middleware first
      return next(new ErrorResponse('User not available for role authorization.', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(
        `User role '${req.user.role}' is not authorized to access this route. Allowed roles: ${roles.join(', ')}.`,
        403 // Forbidden
      ));
    }
    next();
  };
};