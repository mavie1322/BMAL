const format = require("pg-format");
const connection = require("../connection");
const {
  dropTables,
  createArticlesTable,
  createCommentsTable,
  createTopicsTable,
  createUsersTable,
  formatUsersData,
  formatArticlesData,
  formatCommentsData,
  formatTopicsData,
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
          RETURNING *;`,
          formatTopicsData(topicData)
        );
        return connection.query(insertTopicsData);
      })
      .then(() => {
        const insertUsersData = format(
          `INSERT INTO users
          (username, name, avatar_url)
          VALUES %L
          RETURNING *;`,
          formatUsersData(userData)
        );
        return connection.query(insertUsersData);
      })
      .then(() => {
        const insertArticlesData = format(
          `INSERT INTO articles
          (title, topic, author, body, created_at, votes)
          VALUES %L
          RETURNING *;`,
          formatArticlesData(articleData)
        );
        return connection.query(insertArticlesData);
      })
      .then(() => {
        const insertCommentsData = format(
          `INSERT INTO comments
          (body, votes, author, article_id, created_at)
          VALUES %L
          RETURNING *;`,
          formatCommentsData(commentData)
        );
        return connection.query(insertCommentsData);
      })
  );
};

module.exports = seed;
