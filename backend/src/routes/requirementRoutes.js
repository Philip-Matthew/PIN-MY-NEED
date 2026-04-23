// routes/requirementRoutes.js — UPDATED (drop-in replacement)
// Added: GET /my, GET /stats, GET /:id, DELETE /:id
// Route ORDER matters — specific routes before /:id param routes

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const {
  createRequirement,
  getNearbyRequirements,
  getMyRequirements,
  getRequirementById,
  voteRequirement,
  upvoteRequirement,
  deleteRequirement,
  getDemandZones,
  getCategoryStats,
} = require("../controllers/requirementController");

// ── Specific routes first (must come before /:id) ──────────────────────────
router.get("/nearby", protect, getNearbyRequirements);   // GET /api/requirements/nearby
router.get("/my", protect, getMyRequirements);           // GET /api/requirements/my       NEW
router.get("/zones", protect, getDemandZones);           // GET /api/requirements/zones
router.get("/stats", protect, getCategoryStats);         // GET /api/requirements/stats    NEW

// ── CRUD ───────────────────────────────────────────────────────────────────
router.post("/", protect, createRequirement);            // POST /api/requirements
router.get("/:id", protect, getRequirementById);         // GET  /api/requirements/:id     NEW
router.delete("/:id", protect, deleteRequirement);       // DELETE /api/requirements/:id   NEW

// ── Vote routes ────────────────────────────────────────────────────────────
router.post("/:id/vote", protect, voteRequirement);      // POST /api/requirements/:id/vote   (toggle)
router.post("/:id/upvote", protect, upvoteRequirement);  // POST /api/requirements/:id/upvote (one-way)

module.exports = router;
