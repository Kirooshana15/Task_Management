const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: "Logged in successfully.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  TOKEN_MISSING: "Access token is missing. Please log in.",
  TOKEN_INVALID: "Access token is invalid or has been tampered with.",
  TOKEN_EXPIRED: "Access token has expired. Please log in again.",
  FORBIDDEN: "You do not have permission to perform this action.",

  // User
  USER_FETCHED: "User profile fetched successfully.",

  // Requests
  REQUEST_CREATED: "Service request created successfully.",
  REQUEST_FETCHED: "Service request(s) fetched successfully.",
  REQUEST_UPDATED: "Service request updated successfully.",
  REQUEST_STATUS_UPDATED: "Service request status updated successfully.",
  REQUEST_DELETED: "Service request deleted successfully.",
  REQUEST_NOT_FOUND: "Service request not found.",
  REQUEST_INVALID_STATUS_TRANSITION: "Invalid status transition.",

  // Work Items
  WORK_ITEM_CREATED: "Work item created successfully.",
  WORK_ITEM_FETCHED: "Work item(s) fetched successfully.",
  WORK_ITEM_UPDATED: "Work item updated successfully.",
  WORK_ITEM_STATUS_UPDATED: "Work item status updated successfully.",
  WORK_ITEM_NOTE_ADDED: "Note added to work item successfully.",
  WORK_ITEM_DELETED: "Work item deleted successfully.",
  WORK_ITEM_NOT_FOUND: "Work item not found.",
  WORK_ITEM_WRONG_OWNER: "You can only modify your own work items.",

  // Dashboard
  DASHBOARD_FETCHED: "Dashboard statistics fetched successfully.",

  // Validation
  VALIDATION_ERROR: "Validation failed. Please check your input.",

  // Server
  SERVER_ERROR: "An unexpected error occurred. Please try again later.",
};

module.exports = MESSAGES;
