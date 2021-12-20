const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("./db");
require("./config/passport");

// Config .env file
dotenv.config();

// Initiating the app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Roles Router
const rolesRouter = require("./routers/routes/roles");
app.use(rolesRouter);

// Status Router
const statusRouter = require("./routers/routes/status");
app.use(statusRouter);

// Users Router
const usersRouter = require("./routers/routes/users");
app.use(usersRouter);

// Get PORT variable from .env
const PORT = process.env.PORT || 5000;

// Start the app
app.listen(PORT, () => {
  console.log(`SERVER ON PORT ${PORT}`);
});
