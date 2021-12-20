const mongoose = require("mongoose");

// Auctions Schema
const auctionsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  initialPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  currentPrice: {
    type: Number,
    default: 0,
  },
  minIncrement: {
    type: Number,
    required: true,
    default: 1,
  },
  categories: [
    {
      type: String,
    },
  ],
  endDateTime: {
    type: Date,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  sold: {
    type: Boolean,
    default: false,
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

const auctionsModel = mongoose.model("auctions", auctionsSchema);

module.exports = auctionsModel;
