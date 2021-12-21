const express = require("express");

const {
  getAuctions,
  getAuction,
  getHomeAuctions,
  userAuctions,
  createAuction,
  editAuction,
} = require("../controllers/auctions");
const authentication = require("../middlewares/authentication");

const statusRouter = express.Router();

statusRouter.get("/auctions", getAuctions);
statusRouter.get("/auctions/:id", getAuction);
statusRouter.get("/homeAuctions", getHomeAuctions);
statusRouter.get("/userAuctions/:id", authentication, userAuctions);
statusRouter.post("/auctions", authentication, createAuction);
statusRouter.put("/auctions/:id", authentication, editAuction);

module.exports = statusRouter;
