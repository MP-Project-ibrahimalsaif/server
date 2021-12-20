const mongoose = require("mongoose");

// Status Schema
const statusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const statusModel = mongoose.model("status", statusSchema);

module.exports = statusModel;
