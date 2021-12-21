const express = require("express");

const { getReports, createReport } = require("../controllers/reports");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const reportsRouter = express.Router();

reportsRouter.get("/reports", authentication, authorization, getReports);
reportsRouter.post("/reports/:id", authentication, createReport);

module.exports = reportsRouter;
