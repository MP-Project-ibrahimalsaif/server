const auctionsModel = require("./../../db/models/auctions");
const invoicesModel = require("./../../db/models/invoices");
const bidsModel = require("./../../db/models/bids");
const schedule = require("node-schedule");
const dotenv = require("dotenv");

// Config .env file
dotenv.config();

const getAuctions = (req, res) => {
  auctionsModel
    .find({ status: process.env.APPROVED_STATUS })
    .populate("createdBy")
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
    .findOne({ _id: id, status: process.env.APPROVED_STATUS })
    .populate("createdBy buyer")
    .then(async (result) => {
      if (result) {
        const bids = await bidsModel
          .find({ auction: id })
          .populate("createdBy");
        res.status(200).json({ auction: result, bids });
      } else
        res
          .status(404)
          .json({ message: `there is no auction with the ID: ${id}` });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const userAuctions = (req, res) => {
  const { id } = req.params;

  auctionsModel
    .find({ createdBy: id })
    .populate("status")
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
    currentPrice: initialPrice,
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
      schedule.scheduleJob(endDateTime, async () => {
        const auction = await auctionsModel.findOne({ _id: result._id });

        await auctionsModel.findByIdAndUpdate(auction._id, {
          sold: true,
        });

        const newInvoices = new invoicesModel({
          auction: auction._id,
          buyer: auction.buyer,
          status: process.env.PENDING_STATUS,
        });
        newInvoices.save();
      });
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const editAuction = async (req, res) => {
  const { id } = req.params;
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

  const auction = await auctionsModel.findOne({
    _id: id,
    createdBy: req.token.id,
    status: process.env.APPROVED_STATUS,
    sold: false,
  });

  if (auction) {
    auctionsModel
      .findOneAndUpdate(
        {
          _id: id,
          createdBy: req.token.id,
          status: process.env.APPROVED_STATUS,
          sold: false,
        },
        {
          title: title ? title : auction.title,
          description: description ? description : auction.description,
          images: images ? images : auction.images,
          initialPrice: initialPrice ? initialPrice : auction.initialPrice,
          minIncrement: minIncrement ? minIncrement : auction.minIncrement,
          categories: categories ? categories : auction.categories,
          endDateTime: endDateTime ? endDateTime : auction.endDateTime,
          condition: condition ? condition : auction.condition,
        },
        { new: true }
      )
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          res
            .status(404)
            .json({ message: `There is no auction with this ID: ${id}` });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res
      .status(404)
      .json({ message: `There is no auction with this ID: ${id}` });
  }
};

const getAllAuctions = (req, res) => {
  auctionsModel
    .find({})
    .populate("createdBy status")
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "there is no auctions yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const changeAuctionStatus = (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;

  auctionsModel
    .findOneAndUpdate(
      {
        _id: id,
        sold: false,
      },
      {
        status: status_id,
      },
      { new: true }
    )
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: `There is no auction with this ID: ${id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = {
  getAuctions,
  getAuction,
  userAuctions,
  createAuction,
  editAuction,
  getAllAuctions,
  changeAuctionStatus,
};
