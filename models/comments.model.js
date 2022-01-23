const connection = require('../db/connection.js');

exports.updateCommentById = (comment_id, votes = 0) => {
  return connection
    .query(
      `UPDATE comments
        SET votes = comments.votes + $1
        WHERE comments.comment_id = ${comment_id} RETURNING *;`,
      [votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return connection
    .query(
      `
      SELECT comment_id, votes, created_at,
      author,body
      FROM comments
      WHERE comments.article_id = ${article_id};
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByArticleId = (article_id, reqBody) => {
  const { username, body } = reqBody;

  return connection
    .query(
      `INSERT INTO comments (author, body, article_id, votes)
      VALUES ($1, $2, $3, $4) RETURNING*;`,
      [username, body, article_id, 0]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteCommentById = (comment_id) => {
  return connection.query(
    `DELETE FROM comments
    WHERE comment_id = $1 RETURNING*;`,
    [comment_id]
  );
};
