const express = require('express');
const app = express();
const {
  getTopics,
  getArticleById,
  getCommentsByArticleId,
  patchArticleById,
  getArticles,
  postCommentByArticleId,
  removeCommentById,
  getUsers,
  getUserByUsername,
  patchCommentById,
} = require('./controllers/articles.controllers');

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handle404s,
} = require('./errors/index');

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers);
app.get('/api/users/:username', getUserByUsername);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.delete('/api/comments/:comment_id', removeCommentById);
app.patch('/api/comments/:comment_id', patchCommentById);

//ERROR HANDLING
// app.use((err, req, res, next) => {
//   res.status(400).send({ msg: "Bad Request" });
// });
app.all('*', handle404s);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);
module.exports = app;
