const connection = require("../connection");

exports.dropTables = (name) => {
  return connection.query(`DROP TABLE IF EXISTS ${name};`);
};

exports.createTopicsTable = () => {
  return connection.query(`
    CREATE TABLE topics (
        descrition VARCHAR(100) NOT NULL,
        slug VARCHAR(20) PRIMARY KEY
    );
    `);
};

exports.createUsersTable = () => {
  return connection.query(`
        CREATE TABLE users (
        username VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        avatar_url TEXT NOT NULL
        ); `);
};

exports.createArticlesTable = () => {
  return connection.query(`
        CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        topic VARCHAR(30) REFERENCES topics(slug),
        author VARCHAR(50) REFERENCES users(username),
        body TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0
        );`);
};

exports.createCommentsTable = () => {
  return connection.query(`
        CREATE TABLE comments (
        comment_id INT PRIMARY KEY,
        body TEXT NOT NULL,
        votes INT DEFAULT 0, 
        author VARCHAR(50) REFERENCES users(username),
        article_id INT REFERENCES articles(article_id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );`);
};
