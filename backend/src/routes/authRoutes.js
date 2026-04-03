const express = require("express");
const router = express.Router();
const { login, logout, getMe, getUsers } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { loginSchema } = require("../validators/authValidator");

// POST /api/v1/auth/login
router.post("/login", validate(loginSchema), login);

// POST /api/v1/auth/logout
router.post("/logout", verifyToken, logout);

// GET /api/v1/auth/me
router.get("/me", verifyToken, getMe);

// GET /api/v1/auth/users 
router.get("/users", verifyToken, getUsers);

module.exports = router;
