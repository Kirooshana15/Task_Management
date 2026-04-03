const express = require("express");
const router = express.Router();
const {
  getAllWorkItems,
  getWorkItemById,
  createWorkItem,
  updateWorkItem,
  updateWorkItemStatus,
  addNote,
  deleteWorkItem,
} = require("../controllers/workItemController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createWorkItemSchema,
  updateWorkItemSchema,
  updateWorkItemStatusSchema,
  addNoteSchema,
} = require("../validators/workItemValidator");

// All work item routes require authentication
router.use(verifyToken);

// GET /api/v1/work-items — Admin, Coordinator, Developer (filtered by ownership in controller)
router.get("/", getAllWorkItems);

// GET /api/v1/work-items/:id — Admin, Coordinator, Developer (ownership enforced in controller)
router.get("/:id", getWorkItemById);

// POST /api/v1/work-items — Admin & Coordinator only
router.post(
  "/",
  authorizeRoles("admin", "coordinator"),
  validate(createWorkItemSchema),
  createWorkItem
);

// PUT /api/v1/work-items/:id — Admin & Coordinator only
router.put(
  "/:id",
  authorizeRoles("admin", "coordinator"),
  validate(updateWorkItemSchema),
  updateWorkItem
);

// PATCH /api/v1/work-items/:id/status — All roles (ownership enforced in controller)
router.patch("/:id/status", validate(updateWorkItemStatusSchema), updateWorkItemStatus);

// POST /api/v1/work-items/:id/notes — All roles (ownership enforced in controller)
router.post("/:id/notes", validate(addNoteSchema), addNote);

// DELETE /api/v1/work-items/:id — Admin only
router.delete("/:id", authorizeRoles("admin"), deleteWorkItem);

module.exports = router;
