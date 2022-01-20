const connection = require('../db/connection');

exports.selectTopics = () => {
  // try {
  //   const result = await connection.query(`SELECT * FROM topics;`);
  //   return result.rows;
  // } catch (err) {
  //   return Promise.reject({ status: 404, msg: "Not Found" });
  // }
  return connection.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticlesById = async (id) => {
  return connection
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count
  FROM articles
  JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = ${id}
  GROUP BY articles.article_id;`
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticlesById = (article_id, votes) => {
  return connection
    .query(
      `UPDATE articles
      SET votes = articles.votes + $1
      WHERE articles.article_id = ${article_id} RETURNING *;`,
      [votes]
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows[0];
    });
};

exports.selectArticles = (queries) => {
  const sort = queries.sort_by;
  const order = queries.order;
  const topic = queries.topic;

  const queryArray = [];
  const whereTopic = topic ? `WHERE topic = $1` : '';

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

exports.selectCommentsByArticleId = (article_id) => {
  // const comment = await connection.query(`
  //SELECT comment_id, votes, created_at,
  //author,body
  //FROM comments
  //WHERE comments.article_id = ${id};
  //`);

  // return comment.rows;
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
      `INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3) RETURNING*;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteCommentById = (comment_id) => {
  return connection
    .query(
      `DELETE FROM comments
  WHERE comment_id = $1 RETURNING*;`,
      [comment_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectUsers = () => {
  return connection.query('SELECT username FROM users;').then(({ rows }) => {
    return rows;
  });
};

exports.selectUserByUsername = (username) => {
  return connection
    .query(
      `SELECT *
      FROM users
      WHERE username = '${username}';`
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateCommentById = (comment_id, votes) => {
  console.log(comment_id);
  return connection
    .query(
      `UPDATE comments
      SET votes = comments.votes + $1
      WHERE comments.comment_id = ${comment_id} RETURNING *;`,
      [votes]
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows[0];
    });
};
