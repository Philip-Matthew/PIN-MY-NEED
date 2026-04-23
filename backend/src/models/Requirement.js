const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    votes: {
      type: Number,
      default: 1,
    },
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

// 🔥 This index enables geo queries
requirementSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Requirement", requirementSchema);
