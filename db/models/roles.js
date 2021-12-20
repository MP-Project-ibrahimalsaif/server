const mongoose = require("mongoose");

// Roles Schema
const rolesSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  permissions: {
    type: Array,
    required: true,
  },
});

const rolesModel = mongoose.model("roles", rolesSchema);

module.exports = rolesModel;