const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const requirementRoutes = require("./routes/requirementRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "PinMyNeed API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requirements", requirementRoutes);

module.exports = app;
