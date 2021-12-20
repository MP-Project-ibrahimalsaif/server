const mongoose = require("mongoose");

// Bids Schema
const bidsSchema = new mongoose.Schema({
  bid: {
    type: Number,
    required: true,
    default: 1,
  },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auctions",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const bidsModel = mongoose.model("bids", bidsSchema);

module.exports = bidsModel;
