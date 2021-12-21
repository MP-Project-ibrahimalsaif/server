const express = require("express");

const { getAuctions, createAuction } = require("../controllers/auctions");
const authentication = require("../middlewares/authentication");

const statusRouter = express.Router();

statusRouter.get("/auctions", getAuctions);
statusRouter.post("/auctions", authentication, createAuction);

module.exports = statusRouter;
