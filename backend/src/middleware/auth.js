const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT_SECRET is guaranteed to exist — server.js validates it at startup.

// ─── Main protect middleware ───────────────────────────────────────────────────
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token — please log in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired — please log in again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ─── Role guard (optional helper) ─────────────────────────────────────────────
// Usage in routes: router.get("/business-only", protect, restrictTo("business"), handler)
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access restricted to: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

module.exports = protect;
module.exports.restrictTo = restrictTo;
