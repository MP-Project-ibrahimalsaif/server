const bidsModel = require("./../../db/models/bids");
const auctionsModel = require("./../../db/models/auctions");

const getAuctionBids = (req, res) => {
  const { id } = req.params;

  bidsModel
    .find({ auction: id })
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else
        res.status(404).json({
          message: `there is no bids for the auction with the ID: ${id}`,
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const getUserBids = (req, res) => {
  const { id } = req.params;

  bidsModel
    .find({ createdBy: id })
    .populate({
      path : 'auction',
      populate : {
        path : 'createdBy'
      }
    })
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else
        res.status(404).json({
          message: `there is no bids for the user with the ID: ${id}`,
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const addBid = (req, res) => {
  const { id } = req.params;
  const { bid } = req.body;

  const newBid = new bidsModel({
    bid,
    auction: id,
    createdBy: req.token.id,
  });

  newBid
    .save()
    .then(async (result) => {
      await auctionsModel.findByIdAndUpdate(id, {
        $inc: { bids: 1 },
        currentPrice: bid,
        buyer: req.token.id,
      });
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = {
  getAuctionBids,
  getUserBids,
  addBid,
};
