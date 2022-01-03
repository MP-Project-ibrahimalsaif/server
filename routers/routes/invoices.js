const express = require("express");

const { getInvoices } = require("../controllers/invoices");
const authentication = require("../middlewares/authentication");

const invoicesRouter = express.Router();

invoicesRouter.get("/invoices", authentication, getInvoices);

module.exports = invoicesRouter;
