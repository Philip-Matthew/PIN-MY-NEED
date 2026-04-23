const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const requirementRoutes = require("./routes/requirementRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allowed origins: set FRONTEND_URL in your .env / Vercel env vars.
// Multiple origins supported (comma-separated), e.g.:
//   FRONTEND_URL=https://pin-my-need-frontend.vercel.app,http://localhost:3000
const rawOrigins = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = rawOrigins.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "PinMyNeed API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requirements", requirementRoutes);

module.exports = app;
