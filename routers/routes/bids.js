const express = require("express");

const { getAuctionBids, addBid } = require("../controllers/bids");
const authentication = require("../middlewares/authentication");

const bidsRouter = express.Router();

bidsRouter.get("/auctionBids/:id", getAuctionBids);
bidsRouter.post("/bids/:id", authentication, addBid);

module.exports = bidsRouter;
