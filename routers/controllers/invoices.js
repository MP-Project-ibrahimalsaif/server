const invoicesModel = require("./../../db/models/invoices");

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

module.exports = { getInvoices };
