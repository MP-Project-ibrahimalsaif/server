const auctionsModel = require("./../../db/models/auctions");
const dotenv = require("dotenv");

// Config .env file
dotenv.config();

const getAuctions = (req, res) => {
  auctionsModel
    .find({})
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "there is no auctions yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const getAuction = (req, res) => {
  const { id } = req.params;

  auctionsModel
    .findOne({ _id: id })
    .then((result) => {
      if (result) res.status(200).json(result);
      else
        res
          .status(404)
          .json({ message: `there is no auction with the ID: ${id}` });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

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
    status: process.env.APPROVED_STATUS,
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

module.exports = { getAuctions, getAuction, createAuction };
