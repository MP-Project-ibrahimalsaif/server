const express = require("express");

const { createReport } = require("../controllers/reports");
const authentication = require("../middlewares/authentication");

const reportsRouter = express.Router();

reportsRouter.post("/reports/:id", authentication, createReport);

module.exports = reportsRouter;
