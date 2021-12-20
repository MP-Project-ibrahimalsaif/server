const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Config .env file
dotenv.config();

// Get DB_URL variable from .env
const DB_URL = process.env.DB_URL;

// DB Options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Establish The DB Connection
mongoose.connect(DB_URL, options).then(
  () => {
    console.log("DB Ready To Use");
  },
  (err) => {
    console.log(err);
  }
);
