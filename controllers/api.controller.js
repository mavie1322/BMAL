const { readSummaryEndpoints } = require("../models/api.models");

exports.getSummaryEndpoints = (req, res, next) => {
  readSummaryEndpoints()
    .then((endpointsFile) => {
      res.status(200).send({ endpoints: endpointsFile });
    })
    .catch((err) => {
      next(err);
    });
};
