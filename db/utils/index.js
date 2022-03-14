const connection = require("../connection");

exports.dropTables = (name) => {
  return connection.query(`DROP TABLE IF EXISTS ${name};`);
};

exports.createTopicsTable = () => {
  return connection.query(`
    CREATE TABLE topics (
        description VARCHAR(100) NOT NULL,
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
        votes INT NOT NULL
        );`);
};

exports.createCommentsTable = () => {
  return connection.query(`
        CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body TEXT NOT NULL,
        votes INT NOT NULL, 
        author VARCHAR(50) REFERENCES users(username),
        article_id INT REFERENCES articles(article_id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );`);
};
// add ON DELETE CASCADE on the foreign key constraint in the comments table
exports.addConstraintOnDelete = () => {
  return connection.query(`ALTER TABLE comments
DROP CONSTRAINT comments_article_id_fkey,
ADD CONSTRAINT comments_article_id_fkey
FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE;`);
};

/* The `format` function takes in an array of objects and returns an array of arrays.

Each returned array is values of properties of each object.
 */
exports.formatTopicsData = (topicData) => {
  return topicData.map(({ description, slug }) => {
    return [description, slug];
  });
};

exports.formatUsersData = (userData) => {
  return userData.map(({ username, name, avatar_url }) => {
    return [username, name, avatar_url];
  });
};

exports.formatArticlesData = (articleData) => {
  return articleData.map(
    ({ title, topic, author, body, created_at, votes = 0 }) => {
      return [title, topic, author, body, created_at, votes];
    }
  );
};

exports.formatCommentsData = (commentData) => {
  return commentData.map(
    ({ body, votes = 0, author, article_id, created_at }) => {
      return [body, votes, author, article_id, created_at];
    }
  );
};

exports.checkArticleIdExist = (article_id) => {
  return connection
    .query(
      `SELECT *
      FROM articles
      WHERE articles.article_id = ${article_id}`
    )
    .then(({ rows }) => {
      if (rows.length) {
        return true;
      } else {
        return false;
      }
    });
};

exports.checkCommentIdExist = (comment_id) => {
  return connection
    .query(
      `SELECT *
      FROM comments
      WHERE comments.comment_id = ${comment_id}`
    )
    .then(({ rows }) => {
      if (rows.length) {
        return true;
      } else {
        return false;
      }
    });
};

exports.getArticlesColumn = async () => {
  const articleRows = await connection.query(
    `SELECT column_name 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'articles';`
  );
  const articleColumn = articleRows.rows.map((row) => {
    return row.column_name;
  });
  return articleColumn;
};
