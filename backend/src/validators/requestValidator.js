const Joi = require("joi");

const SERVICE_TYPES = ["Website", "Marketing", "Branding"];
const REQUEST_STATUSES = [
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];

// Schema for creating a new service request
const createRequestSchema = Joi.object({
  clientName: Joi.string().trim().min(2).max(100).required().messages({
    "string.min": "Client name must be at least 2 characters.",
    "any.required": "Client name is required.",
  }),
  serviceType: Joi.string()
    .valid(...SERVICE_TYPES)
    .required()
    .messages({
      "any.only": `Service type must be one of: ${SERVICE_TYPES.join(", ")}.`,
      "any.required": "Service type is required.",
    }),
  title: Joi.string().trim().min(3).max(150).required().messages({
    "string.min": "Title must be at least 3 characters.",
    "any.required": "Title is required.",
  }),
  description: Joi.string().trim().min(10).max(2000).required().messages({
    "string.min": "Description must be at least 10 characters.",
    "any.required": "Description is required.",
  }),
  preferredDeadline: Joi.date().greater("now").required().messages({
    "date.greater": "Preferred deadline must be a future date.",
    "any.required": "Preferred deadline is required.",
  }),
  // status can be Draft (save) or Submitted (submit)
  status: Joi.string().valid("Draft", "Submitted").default("Draft"),
});

// Schema for updating an existing service request
const updateRequestSchema = Joi.object({
  clientName: Joi.string().trim().min(2).max(100),
  serviceType: Joi.string().valid(...SERVICE_TYPES),
  title: Joi.string().trim().min(3).max(150),
  description: Joi.string().trim().min(10).max(2000),
  preferredDeadline: Joi.date(),
  status: Joi.string().valid(...REQUEST_STATUSES),
  reviewNote: Joi.string().trim().max(500).allow("", null),
}).min(1); // At least one field required

// Schema for status-only update (Approve/Reject/Under Review)
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...REQUEST_STATUSES)
    .required()
    .messages({
      "any.only": `Status must be one of: ${REQUEST_STATUSES.join(", ")}.`,
      "any.required": "Status is required.",
    }),
  reviewNote: Joi.string().trim().max(500).allow("", null),
});

module.exports = { createRequestSchema, updateRequestSchema, updateStatusSchema };
