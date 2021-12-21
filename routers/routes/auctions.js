const express = require("express");

const { createAuction } = require("../controllers/auctions");
const authentication = require("../middlewares/authentication");

const statusRouter = express.Router();

statusRouter.post("/auctions", authentication, createAuction);

module.exports = statusRouter;
