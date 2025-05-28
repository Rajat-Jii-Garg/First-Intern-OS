// D:\First-Intern-OS\server\utils\errorResponse.util.js
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.success = false; // To align with other API responses

        Error.captureStackTrace(this, this.constructor); // Maintains a clean stack trace
    }
}

module.exports = ErrorResponse;