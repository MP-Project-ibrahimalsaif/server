const auctionsModel = require("./../../db/models/auctions");

const createAuction = (req, res) => {
  const {
    title,
    description,
    images,
    initialPrice,
    minIncrement,
    categories,
    endDateTime,
    condition,
    status,
  } = req.body;

  const newAuction = new auctionsModel({
    title,
    description,
    images,
    initialPrice,
    minIncrement,
    categories,
    endDateTime,
    condition,
    status,
    createdBy: req.token.id,
  });

  newAuction
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = { createAuction };
