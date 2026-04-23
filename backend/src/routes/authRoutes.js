// routes/authRoutes.js — UPDATED (drop-in replacement)
// Added: GET /api/auth/me  and  PATCH /api/auth/me

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const { register, login, getMe, updateMe } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);          // NEW — get current user
router.patch("/me", protect, updateMe);     // NEW — update name/role

module.exports = router;
