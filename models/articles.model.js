const connection = require("../db/connection");

exports.selectArticleById = (id) => {
  return connection
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = ${id}
        GROUP BY articles.article_id;`
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleById = (article_id, votes = 0) => {
  return connection
    .query(
      `UPDATE articles
        SET votes = articles.votes + $1
        WHERE articles.article_id = ${article_id} RETURNING *;`,
      [votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectArticles = (queries) => {
  const sort = queries.sort_by;
  const order = queries.order.toUpperCase();
  const topic = queries.topic;
  const queryArray = [];
  const whereTopic = topic ? `WHERE topic = $1` : "";
  if (topic) queryArray.push(topic);

  return connection
    .query(
      `SELECT articles.author, articles.title, articles.topic,
        articles.article_id, articles.created_at, articles.votes, 
        COUNT(comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        ${whereTopic}
        GROUP BY articles.article_id
        ORDER BY ${sort} ${order};`,
      queryArray
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.insertArticle = (reqBody) => {
  const { author, title, body, topic } = reqBody;

  return connection
    .query(
      `INSERT INTO articles(author, title, body, topic, votes)
      VALUES($1, $2, $3, $4, $5) RETURNING*;`,
      [author, title, body, topic, 0]
    )
    .then(({ rows }) => {
      rows[0]["comment_count"] = 0;
      return rows[0];
    });
};

exports.deleteArticleById = (article_id) => {
  return connection.query(
    `DELETE FROM articles
    WHERE article_id = $1 RETURNING*;`,
    [article_id]
  );
};
