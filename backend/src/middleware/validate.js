const HTTP = require("../constants/httpStatus");
const ERRORS = require("../constants/errorCodes");
const MESSAGES = require("../constants/messages");

/**
 * Joi/schema validation runner middleware factory.
 * Usage: validate(schema) — schema must be a Joi schema.
 * Validates req.body and returns 422 with field-level errors on failure.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,    // Collect all errors, not just the first
    stripUnknown: true,   // Remove unknown fields from the body
  });

  if (error) {
    const details = error.details.map((d) => ({
      field: d.path.join("."),
      message: d.message.replace(/['"]/g, ""),
    }));

    return res.status(HTTP.UNPROCESSABLE).json({
      success: false,
      errorCode: ERRORS.VALIDATION_ERROR,
      message: MESSAGES.VALIDATION_ERROR,
      errors: details,
    });
  }

  req.body = value; // Replace body with validated + stripped value
  next();
};

module.exports = validate;
