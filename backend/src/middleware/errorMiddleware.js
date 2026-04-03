const HTTP = require("../constants/httpStatus");
const ERRORS = require("../constants/errorCodes");
const MESSAGES = require("../constants/messages");

/**
 * Global error handling middleware.
 * Catches all errors forwarded via next(err) and returns structured JSON responses.
 */
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP.SERVER_ERROR;
  let message = err.message || MESSAGES.SERVER_ERROR;
  let errorCode = err.errorCode || ERRORS.SERVER_ERROR;

  // Mongoose: CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = HTTP.BAD_REQUEST;
    message = `Invalid ID format: ${err.value}`;
    errorCode = ERRORS.VALIDATION_ERROR;
  }

  // Mongoose: Duplicate key violation (unique field)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = HTTP.CONFLICT;
    message = `A record with this ${field} already exists.`;
    errorCode = ERRORS.CONFLICT;
  }

  // Mongoose: Validation errors
  if (err.name === "ValidationError") {
    statusCode = HTTP.UNPROCESSABLE;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    errorCode = ERRORS.VALIDATION_ERROR;
  }

  // JWT errors (fallback, usually handled in authMiddleware)
  if (err.name === "JsonWebTokenError") {
    statusCode = HTTP.UNAUTHORIZED;
    message = MESSAGES.TOKEN_INVALID;
    errorCode = ERRORS.AUTH_TOKEN_INVALID;
  }

  if (err.name === "TokenExpiredError") {
    statusCode = HTTP.UNAUTHORIZED;
    message = MESSAGES.TOKEN_EXPIRED;
    errorCode = ERRORS.AUTH_TOKEN_EXPIRED;
  }

  // Hide stack trace in production
  const response = {
    success: false,
    errorCode,
    message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
