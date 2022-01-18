const format = require("pg-format");
const connection = require("../connection");
const {
  dropTables,
  createArticlesTable,
  createCommentsTable,
  createTopicsTable,
  createUsersTable,
} = require("../utils/index");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  //create tables
  return (
    dropTables("comments")
      .then(() => {
        return dropTables("articles");
      })
      .then(() => {
        return dropTables("users");
      })
      .then(() => {
        return dropTables("topics");
      })
      .then(() => {
        return createTopicsTable();
      })
      .then(() => {
        return createUsersTable();
      })
      .then(() => {
        return createArticlesTable();
      })
      .then(() => {
        return createCommentsTable();
      })
      // 2. insert data
      .then(() => {
        const insertTopicsData = format(
          `INSERT INTO topics
      (description, slug)
      VALUES %L
      RETURNING *`,
          formatTopicsData(topicData)
        );
      })
  );
};

module.exports = seed;
