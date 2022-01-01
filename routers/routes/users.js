const express = require("express");
const passport = require("passport");
const popupTools = require("popup-tools");

require("./../../config/passport");

const {
  signup,
  login,
  logout,
  getProfile,
  userWatchList,
  editAccount,
  addToWatchList,
  deleteFromWatchList,
  getUsers,
  changeRole,
  blockUser,
  unblockUser,
} = require("../controllers/users");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const usersRouter = express.Router();

usersRouter.post("/signup", signup);
usersRouter.post("/login", login);
usersRouter.get("/logout", logout);
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
usersRouter.get("/userWatchList/:id", authentication, userWatchList);
usersRouter.put("/users", authentication, editAccount);
usersRouter.post("/addAuctionToWatchlist/:id", authentication, addToWatchList);
usersRouter.put(
  "/deleteAuctionFromWatchlist/:id",
  authentication,
  deleteFromWatchList
);
usersRouter.get("/users", authentication, authorization, getUsers);
usersRouter.put("/changeRole/:id", authentication, authorization, changeRole);
usersRouter.put("/blockUser/:id", authentication, authorization, blockUser);
usersRouter.put("/unblockUser/:id", authentication, authorization, unblockUser);

module.exports = usersRouter;
