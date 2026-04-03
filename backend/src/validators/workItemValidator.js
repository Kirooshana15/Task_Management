const Joi = require("joi");

const PRIORITIES = ["Low", "Medium", "High"];
const WORK_ITEM_STATUSES = ["Todo", "In Progress", "Review", "Done"];

// Schema for creating a work item
const createWorkItemSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    "string.min": "Title must be at least 3 characters.",
    "any.required": "Title is required.",
  }),
  requestId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "requestId must be a valid MongoDB ObjectId.",
      "any.required": "requestId is required.",
    }),
  assigneeId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "assigneeId must be a valid MongoDB ObjectId.",
      "any.required": "assigneeId is required.",
    }),
  priority: Joi.string()
    .valid(...PRIORITIES)
    .default("Medium"),
  dueDate: Joi.date().greater("now").required().messages({
    "date.greater": "Due date must be a future date.",
    "any.required": "Due date is required.",
  }),
  status: Joi.string().valid(...WORK_ITEM_STATUSES).default("Todo"),
});

// Schema for full update of a work item
const updateWorkItemSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150),
  requestId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  assigneeId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  priority: Joi.string().valid(...PRIORITIES),
  dueDate: Joi.date(),
  status: Joi.string().valid(...WORK_ITEM_STATUSES),
}).min(1);

// Schema for status-only patch
const updateWorkItemStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...WORK_ITEM_STATUSES)
    .required()
    .messages({
      "any.only": `Status must be one of: ${WORK_ITEM_STATUSES.join(", ")}.`,
      "any.required": "Status is required.",
    }),
});

// Schema for adding a note
const addNoteSchema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required().messages({
    "string.min": "Note text cannot be empty.",
    "any.required": "Note text is required.",
  }),
});

module.exports = {
  createWorkItemSchema,
  updateWorkItemSchema,
  updateWorkItemStatusSchema,
  addNoteSchema,
};
