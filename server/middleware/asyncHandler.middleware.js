// D:\First-Intern-OS\server\middleware\asyncHandler.middleware.js
// This utility wraps async route handlers to automatically catch errors
// and pass them to the next error-handling middleware.
const asyncHandler = fn => (req, res, next) =>
    Promise
        .resolve(fn(req, res, next))
        .catch(next); // Pass any caught error to the next middleware (errorHandler)

module.exports = asyncHandler;