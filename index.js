const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
require('./db')

// Config .env file
dotenv.config();

// Initiating the app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Roles Router
const rolesRouter = require("./routers/routes/roles");
app.use(rolesRouter);

// Get PORT variable from .env
const PORT = process.env.PORT || 5000;

// Start the app
app.listen(PORT, () => {
  console.log(`SERVER ON PORT ${PORT}`);
});