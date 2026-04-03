const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const AppError = require("../utils/AppError");
const HTTP = require("../constants/httpStatus");
const ERRORS = require("../constants/errorCodes");
const MESSAGES = require("../constants/messages");
const User = require("../models/User");

/**
 * verifyToken — Extracts and validates the JWT from Authorization header.
 * Attaches decoded user payload to req.user.
 */
const verifyToken = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(MESSAGES.TOKEN_MISSING, HTTP.UNAUTHORIZED, ERRORS.AUTH_TOKEN_MISSING);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch fresh user from DB to ensure they still exist
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError(MESSAGES.TOKEN_INVALID, HTTP.UNAUTHORIZED, ERRORS.AUTH_TOKEN_INVALID);
      }

      // Check if token was issued before the most recent logout
      const issuedAt = new Date(decoded.iat * 1000);
      
      if (user.lastLogout && issuedAt < user.lastLogout) {
        throw new AppError(MESSAGES.TOKEN_EXPIRED, HTTP.UNAUTHORIZED, ERRORS.AUTH_TOKEN_EXPIRED);
      }

      req.user = user;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new AppError(MESSAGES.TOKEN_EXPIRED, HTTP.UNAUTHORIZED, ERRORS.AUTH_TOKEN_EXPIRED);
      }
      if (err.isOperational) throw err;
      throw new AppError(MESSAGES.TOKEN_INVALID, HTTP.UNAUTHORIZED, ERRORS.AUTH_TOKEN_INVALID);
    }
  } catch (err) {
    next(err);
  }
};

/**
 * authorizeRoles — Role-based access control gate.
 * Usage: authorizeRoles("admin", "coordinator")
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(MESSAGES.FORBIDDEN, HTTP.FORBIDDEN, ERRORS.AUTH_FORBIDDEN)
      );
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
