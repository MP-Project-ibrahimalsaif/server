const auctionsModel = require("./../../db/models/auctions");
const dotenv = require("dotenv");

// Config .env file
dotenv.config();

const getAuctions = (req, res) => {
  auctionsModel
    .find({ status: process.env.APPROVED_STATUS, sold: false })
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
    .findOne({ _id: id, status: process.env.APPROVED_STATUS, sold: false })
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

const getHomeAuctions = (req, res) => {
  auctionsModel
    .find({ status: process.env.APPROVED_STATUS, sold: false })
    .sort({ endDateTime: 1 })
    .then((result) => {
      if (result.length > 0)
        res
          .status(200)
          .json({ lastMin: result.slice(-10), new: result.slice(0, 10) });
      else res.status(404).json({ message: "there is no auctions yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const userAuctions = (req, res) => {
  const { id } = req.params;

  auctionsModel
    .find({ createdBy: id, status: process.env.APPROVED_STATUS })
    .sort({ endDateTime: 1 })
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "this user has no auctions yet!!" });
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

module.exports = {
  getAuctions,
  getAuction,
  getHomeAuctions,
  userAuctions,
  createAuction,
};
