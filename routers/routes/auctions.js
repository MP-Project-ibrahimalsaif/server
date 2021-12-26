const express = require("express");

const {
  getAuctions,
  getAuction,
  userAuctions,
  createAuction,
  editAuction,
  changeAuctionStatus,
} = require("../controllers/auctions");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const auctionsRouter = express.Router();

auctionsRouter.get("/auctions", getAuctions);
auctionsRouter.get("/auctions/:id", getAuction);
auctionsRouter.get("/userAuctions/:id", authentication, userAuctions);
auctionsRouter.post("/auctions", authentication, createAuction);
auctionsRouter.put("/auctions/:id", authentication, editAuction);
auctionsRouter.put(
  "/changeAuctionStatus/:id",
  authentication,
  authorization,
  changeAuctionStatus
);

module.exports = auctionsRouter;
