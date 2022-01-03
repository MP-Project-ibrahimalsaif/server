const invoicesModel = require("./../../db/models/invoices");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const getInvoices = (req, res) => {
  invoicesModel
    .find({ buyer: req.token.id })
    .populate("auction status")
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "there is no invoices yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const updatePayment = (req, res) => {
  const { id } = req.params;

  invoicesModel
    .findOneAndUpdate(
      { _id: id, buyer: req.token.id },
      { paid: true, status: process.env.APPROVED_STATUS },
      { new: true }
    )
    .then((result) => {
      if (result) res.status(200).json(result);
      else
        res
          .status(404)
          .json({ message: `there is no invoice with the ID ${id}` });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

const payment = async (req, res) => {
  const { items } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "sar",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

module.exports = { getInvoices, updatePayment, payment };
