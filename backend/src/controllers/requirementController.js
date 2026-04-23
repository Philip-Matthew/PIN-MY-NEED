// controllers/requirementController.js — UPDATED (drop-in replacement)
// Bug fixes:
//   1. voteRequirement — was calling .includes() on a Number (votes). Fixed.
//   2. getDemandZones — was doing $size on a Number field. Fixed to use `votes` directly.
// New features:
//   3. getMyRequirements — GET /api/requirements/my — user's own pins
//   4. deleteRequirement  — DELETE /api/requirements/:id — owner or admin only
//   5. getNearbyRequirements now supports `sortBy` (votes|createdAt) query param
//   6. getRequirementById — GET /api/requirements/:id

const Requirement = require("../models/Requirement");
const mongoose = require("mongoose");

// ─── CREATE PIN ────────────────────────────────────────────────────────────────
// POST /api/requirements
exports.createRequirement = async (req, res) => {
  try {
    const { category, description, latitude, longitude } = req.body;
    const userId = req.user._id;

    if (!category || !latitude || !longitude)
      return res.status(400).json({ message: "Category, latitude & longitude required" });

    // Prevent duplicate pins within 300m of same category
    const existing = await Requirement.findOne({
      category: { $regex: new RegExp(`^${category}$`, "i") },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 300,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Similar requirement already exists nearby. Upvote it instead.",
        existingId: existing._id,
      });
    }

    const requirement = await Requirement.create({
      user: userId,
      category: category.trim(),
      description: description?.trim(),
      voters: [userId],
      votes: 1,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    await requirement.populate("user", "name phone role");
    res.status(201).json(requirement);
  } catch (error) {
    console.error("createRequirement error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─── GET NEARBY ────────────────────────────────────────────────────────────────
// GET /api/requirements/nearby?latitude=&longitude=&radius=&category=&sortBy=&page=&limit=
exports.getNearbyRequirements = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 5000,
      category,
      sortBy = "votes",   // "votes" | "createdAt"
      page = 1,
      limit = 50,
    } = req.query;

    if (!latitude || !longitude)
      return res.status(400).json({ message: "Latitude & longitude required" });

    const geoFilter = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    };

    if (category) geoFilter.category = { $regex: new RegExp(category, "i") };

    // $near doesn't support secondary sort — fetch then sort in JS
    let results = await Requirement.find(geoFilter)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate("user", "name phone role");

    if (sortBy === "votes") {
      results = results.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    }

    res.json(results);
  } catch (error) {
    console.error("getNearbyRequirements error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─── GET MY REQUIREMENTS ───────────────────────────────────────────────────────
// GET /api/requirements/my
// Returns all requirements created by the logged-in user
exports.getMyRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "name phone role");

    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET BY ID ─────────────────────────────────────────────────────────────────
// GET /api/requirements/:id
exports.getRequirementById = async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id).populate(
      "user",
      "name phone role"
    );
    if (!requirement)
      return res.status(404).json({ message: "Requirement not found" });
    res.json(requirement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPVOTE ────────────────────────────────────────────────────────────────────
// POST /api/requirements/:id/upvote
exports.upvoteRequirement = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const requirement = await Requirement.findById(id);
    if (!requirement)
      return res.status(404).json({ message: "Requirement not found" });

    // Prevent creator from voting their own pin
    if (requirement.user.toString() === userId.toString())
      return res.status(400).json({ message: "You cannot upvote your own pin" });

    // Prevent double voting — voters is an array of ObjectIds
    const alreadyVoted = requirement.voters.some(
      (v) => v.toString() === userId.toString()
    );
    if (alreadyVoted)
      return res.status(400).json({ message: "Already voted" });

    requirement.voters.push(userId);
    requirement.votes += 1;
    await requirement.save();

    res.json({
      _id: requirement._id,
      votes: requirement.votes,
      voters: requirement.voters,
    });
  } catch (err) {
    console.error("upvoteRequirement error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ─── VOTE (TOGGLE) ─────────────────────────────────────────────────────────────
// POST /api/requirements/:id/vote  (toggle upvote/undo)
// BUG FIX: original used requirement.votes.includes() on a Number — fixed here
exports.voteRequirement = async (req, res) => {
  try {
    const userId = req.user._id;
    const requirement = await Requirement.findById(req.params.id);

    if (!requirement)
      return res.status(404).json({ message: "Requirement not found" });

    // voters is the array — check that, not votes (which is a Number)
    const alreadyVoted = requirement.voters.some(
      (v) => v.toString() === userId.toString()
    );

    if (alreadyVoted) {
      // Undo vote
      requirement.voters = requirement.voters.filter(
        (v) => v.toString() !== userId.toString()
      );
      requirement.votes = Math.max(1, requirement.votes - 1);
    } else {
      requirement.voters.push(userId);
      requirement.votes += 1;
    }

    await requirement.save();
    res.json({ votes: requirement.votes, voted: !alreadyVoted });
  } catch (err) {
    console.error("voteRequirement error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE ────────────────────────────────────────────────────────────────────
// DELETE /api/requirements/:id
// Only the creator can delete their own pin
exports.deleteRequirement = async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);

    if (!requirement)
      return res.status(404).json({ message: "Requirement not found" });

    if (requirement.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to delete this pin" });

    await requirement.deleteOne();
    res.json({ message: "Requirement deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── DEMAND ZONES ─────────────────────────────────────────────────────────────
// GET /api/requirements/zones
// BUG FIX: original did $size on votes (Number field) — now uses votes directly
exports.getDemandZones = async (req, res) => {
  try {
    const zones = await Requirement.aggregate([
      {
        $group: {
          _id: {
            category: "$category",
            // Round coords to 2 decimal places (~1km grid cells)
            lng: { $round: [{ $arrayElemAt: ["$location.coordinates", 0] }, 2] },
            lat: { $round: [{ $arrayElemAt: ["$location.coordinates", 1] }, 2] },
          },
          totalVotes: { $sum: "$votes" },        // votes is a Number — sum directly
          voterCount: { $sum: { $size: { $ifNull: ["$voters", []] } } },
          count: { $sum: 1 },
          categories: { $addToSet: "$category" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          longitude: "$_id.lng",
          latitude: "$_id.lat",
          totalVotes: 1,
          voterCount: 1,
          pinCount: "$count",
          // demandScore weights votes + unique pins
          demandScore: {
            $add: ["$totalVotes", { $multiply: ["$count", 2] }],
          },
        },
      },
      { $sort: { demandScore: -1 } },
      { $limit: 100 },
    ]);

    res.json(zones);
  } catch (error) {
    console.error("getDemandZones error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─── CATEGORY STATS ───────────────────────────────────────────────────────────
// GET /api/requirements/stats
// Returns aggregated stats per category (useful for Dashboard)
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Requirement.aggregate([
      {
        $group: {
          _id: "$category",
          totalVotes: { $sum: "$votes" },
          pinCount: { $sum: 1 },
          avgVotes: { $avg: "$votes" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalVotes: 1,
          pinCount: 1,
          avgVotes: { $round: ["$avgVotes", 1] },
          demandScore: { $add: ["$totalVotes", { $multiply: ["$pinCount", 2] }] },
        },
      },
      { $sort: { demandScore: -1 } },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
