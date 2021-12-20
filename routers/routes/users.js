const express = require("express");
const passport = require("passport");
const popupTools = require("popup-tools");

require("./../../config/passport");

const { signup, login, getProfile } = require("../controllers/users");

const usersRouter = express.Router();

usersRouter.post("/signup", signup);
usersRouter.post("/login", login);
usersRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
usersRouter.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.end(popupTools.popupResponse(req.user));
  }
);
usersRouter.get("/users/:id", getProfile);

module.exports = usersRouter;
