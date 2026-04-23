// routes/userRoutes.js — UPDATED (drop-in replacement)
// Added: GET /api/users/profile and PATCH /api/users/profile (both protected)

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  createUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

router.get("/profile", protect, getProfile);        // GET  /api/users/profile  NEW
router.patch("/profile", protect, updateProfile);   // PATCH /api/users/profile NEW
router.post("/", createUser);                       // POST /api/users (legacy, kept)

module.exports = router;
