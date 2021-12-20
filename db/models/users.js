const mongoose = require("mongoose");

// Users Schema
const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
  },
  activeCode: {
    type: String,
  },
  passwordCode: {
    type: String,
  },
  watchlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auctions",
    },
  ],
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roles",
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;
