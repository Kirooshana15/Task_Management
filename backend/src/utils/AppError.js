/**
 * Custom application error class.
 * Extends native Error with statusCode and errorCode for structured responses.
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Marks it as a known, expected error
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
