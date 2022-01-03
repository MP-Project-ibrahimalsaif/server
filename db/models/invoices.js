const mongoose = require("mongoose");

// Invoices Schema
const invoicesSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auctions",
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  paid: {
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

const invoicesModel = mongoose.model("invoices", invoicesSchema);

module.exports = invoicesModel;
