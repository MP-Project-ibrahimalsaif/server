const express = require("express");

const { addBid } = require("../controllers/bids");
const authentication = require("../middlewares/authentication");

const bidsRouter = express.Router();

bidsRouter.post("/bids/:id", authentication, addBid);

module.exports = bidsRouter;
