// D:\First-Intern-OS\server\middleware\error.middleware.js
const ErrorResponse = require('../utils/errorResponse.util');

const errorHandler = (err, req, res, next) => {
    let error = { ...err }; // Create a copy of the error object
    error.message = err.message; // Ensure message property is set

    // Log to console for the developer (especially useful in development)
    // In production, you might use a more robust logging solution like Winston or Sentry
    // console.error('ERROR STACK:', err.stack);
    // console.error('ERROR OBJECT:', err);


    // Mongoose Bad ObjectId Error (CastError)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        const message = `Resource not found`; // Generic message for security
        error = new ErrorResponse(message, 404);
    }

    // Mongoose Duplicate Key Error (code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `Duplicate field value entered for '${field}': '${value}'. Please use another value.`;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        const message = `Validation Failed: ${messages.join('. ')}`;
        error = new ErrorResponse(message, 400);
    }

    // JWT (jsonwebtoken library) Errors
    if (err.name === 'JsonWebTokenError') { // Invalid token signature
        const message = 'Not authorized, token is invalid';
        error = new ErrorResponse(message, 401);
    }
    if (err.name === 'TokenExpiredError') { // Token has expired
        const message = 'Not authorized, token has expired';
        error = new ErrorResponse(message, 401);
    }

    // Send response
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
        // stack: process.env.NODE_ENV === 'production' ? undefined : err.stack // Optionally send stack in dev
    });
};

module.exports = errorHandler;