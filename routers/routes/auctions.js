const express = require("express");

const { getAuctions, getAuction, createAuction } = require("../controllers/auctions");
const authentication = require("../middlewares/authentication");

const statusRouter = express.Router();

statusRouter.get("/auctions", getAuctions);
statusRouter.get("/auctions/:id", getAuction);
statusRouter.post("/auctions", authentication, createAuction);

module.exports = statusRouter;
