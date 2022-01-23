const connection = require('../db/connection.js');

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
