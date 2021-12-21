const reportsModel = require("./../../db/models/reports");
const dotenv = require("dotenv");

// Config .env file
dotenv.config();

const getReports = (req, res) => {
  reportsModel
    .find({})
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "there is no reports yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const createReport = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const newReport = new reportsModel({
    reason,
    reported: id,
    reportedBy: req.token.id,
    status: process.env.PENDING_STATUS,
  });

  newReport
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = {
  getReports,
  createReport,
};
