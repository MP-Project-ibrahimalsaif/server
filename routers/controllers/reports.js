const reportsModel = require("./../../db/models/reports");
const dotenv = require("dotenv");

// Config .env file
dotenv.config();

const getReports = (req, res) => {
  reportsModel
    .find({})
    .populate("reported reportedBy status")
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "there is no reports yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const createReport = (req, res) => {
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

const changeReportStatus = (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;

  reportsModel
    .findOneAndUpdate({ _id: id }, { status: status_id }, { new: true })
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: `There is no report with this ID: ${id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = {
  getReports,
  createReport,
  changeReportStatus,
};
