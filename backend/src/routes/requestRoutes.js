const express = require("express");
const router = express.Router();
const {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  updateRequestStatus,
} = require("../controllers/requestController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createRequestSchema,
  updateRequestSchema,
  updateStatusSchema,
} = require("../validators/requestValidator");

// All request routes require authentication
router.use(verifyToken);

// Admin & Coordinator only
router.use(authorizeRoles("admin", "coordinator"));

// GET /api/v1/requests
router.get("/", getAllRequests);

// GET /api/v1/requests/:id
router.get("/:id", getRequestById);

// POST /api/v1/requests
router.post("/", validate(createRequestSchema), createRequest);

// PUT /api/v1/requests/:id
router.put("/:id", validate(updateRequestSchema), updateRequest);

// PATCH /api/v1/requests/:id/status
router.patch("/:id/status", validate(updateStatusSchema), updateRequestStatus);



module.exports = router;
