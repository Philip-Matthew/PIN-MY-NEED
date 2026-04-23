require("dotenv").config();

// ─── Validate required environment variables at startup ───────────────────────
// The server refuses to start if any critical variable is missing.
// This prevents silent failures where a fallback value (like "secret123")
// lets the app run but in an insecure or broken state.
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missing.join(", ")}`,
  );
  console.error(
    "   Create a .env file in /backend — see .env.example for reference.",
  );
  process.exit(1);
}

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
