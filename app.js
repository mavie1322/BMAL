const express = require('express');
const app = express();
const { getSummaryEndpoints } = require('./controllers/api.controller');
const { getTopics } = require('./controllers/topics.controller');
const {
  postCommentByArticleId,
  removeCommentById,
  getCommentsByArticleId,
  patchCommentById,
} = require('./controllers/comments.controller');
const {
  getUsers,
  getUserByUsername,
} = require('./controllers/users.controller');
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require('./controllers/articles.controller');

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

app.get('/api', getSummaryEndpoints);

//ERROR HANDLING
app.all('*', handle404s);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
