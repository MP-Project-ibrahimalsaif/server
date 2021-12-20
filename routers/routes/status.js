const express = require("express");

const { getStatus, createStatus } = require("../controllers/status");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const statusRouter = express.Router();

statusRouter.get("/status", authentication, authorization, getStatus);
statusRouter.post("/status", authentication, authorization, createStatus);

module.exports = statusRouter;
