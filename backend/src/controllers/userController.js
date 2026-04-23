// controllers/userController.js — UPDATED (drop-in replacement)
// Bug fix: generateToken used `user._id` instead of the `id` parameter (runtime ReferenceError)
// New: getProfile, updateProfile endpoints (for Profile page)

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ BUG FIX: was `user._id` (ReferenceError) — now correctly uses `id`
const generateToken = (id) =>
  jwt.sign({ _id: id }, process.env.JWT_SECRET || "secret123", {
    expiresIn: "30d",
  });

// GET /api/users/profile  (protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/users/profile  (protected)
// Update name or role
exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.role && ["customer", "business"].includes(req.body.role))
      updates.role = req.body.role;

    // Allow password change if current password is verified
    if (req.body.newPassword) {
      if (!req.body.currentPassword)
        return res.status(400).json({ message: "Current password required" });

      const user = await User.findById(req.user._id);
      const match = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!match)
        return res.status(400).json({ message: "Current password incorrect" });

      updates.password = await bcrypt.hash(req.body.newPassword, 10);
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users  (legacy — kept for backward compatibility)
exports.createUser = async (req, res) => {
  try {
    const { name, phone, role } = req.body;

    if (!name || !phone)
      return res.status(400).json({ message: "Name and phone required" });

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ name, phone, role });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
