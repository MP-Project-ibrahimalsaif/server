const bidsModel = require("./../../db/models/bids");

const addBid = async (req, res) => {
  const { id } = req.params;
  const { bid } = req.body;

  const newBid = new bidsModel({
    bid,
    auction: id,
    createdBy: req.token.id,
  });

  newBid
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = {
  addBid,
};
