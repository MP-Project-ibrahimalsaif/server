const reportsModel = require("./../../db/models/reports");
const dotenv = require("dotenv");

// Config .env file
dotenv.config();

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
  createReport,
};
