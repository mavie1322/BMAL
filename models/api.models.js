const fs = require('fs/promises');

exports.readSummaryEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, 'utf-8')
    .then((apiFile) => {
      return apiFile;
    });
};
//home/mavie1322/northcoders/backend/be-nc-news/endpoints.json
