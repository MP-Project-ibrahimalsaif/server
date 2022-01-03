const express = require("express");

const { getInvoices, updatePayment, payment } = require("../controllers/invoices");
const authentication = require("../middlewares/authentication");

const invoicesRouter = express.Router();

invoicesRouter.get("/invoices", authentication, getInvoices);
invoicesRouter.put("/invoices/:id", authentication, updatePayment);
invoicesRouter.post("/create-payment-intent", payment);

module.exports = invoicesRouter;
