// controllers/authController.js — UPDATED (drop-in replacement)
// Changes:
//   1. register & login now return { token, user } so the frontend can store name/phone/role
//   2. register now accepts optional `role` field ("customer" | "business")
//   3. Consistent JWT_SECRET usage (no more fallback to "secret123" in prod — use .env)
//   4. Added `getMe` for GET /api/auth/me to fetch current logged-in user

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET || "secret123", {
    expiresIn: "30d",
  });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    if (!name || !phone || !password)
      return res.status(400).json({ message: "All fields required" });

    if (phone.length < 10)
      return res.status(400).json({ message: "Enter a valid phone number" });

    const exists = await User.findOne({ phone });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hash,
      role: role || "customer",
    });

    const token = signToken(user._id);

    // ✅ Return user object so frontend can store name/phone/role
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password)
      return res.status(400).json({ message: "Phone and password required" });

    const user = await User.findOne({ phone });
    if (!user)
      return res.status(400).json({ message: "Invalid phone or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid phone or password" });

    const token = signToken(user._id);

    // ✅ Return user object so frontend can store name/phone/role
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me  (protected)
// Returns the currently logged-in user's profile
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/auth/me  (protected)
// Lets the user update their name or role
exports.updateMe = async (req, res) => {
  try {
    const allowed = {};
    if (req.body.name) allowed.name = req.body.name.trim();
    if (req.body.role && ["customer", "business"].includes(req.body.role))
      allowed.role = req.body.role;

    const user = await User.findByIdAndUpdate(req.user._id, allowed, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
