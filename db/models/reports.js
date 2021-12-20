const mongoose = require("mongoose");

// Reports Schema
const reportsSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  reported: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "status",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const reportsModel = mongoose.model("reports", reportsSchema);

module.exports = reportsModel;
