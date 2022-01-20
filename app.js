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

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/users', getUsers);
app.get('/api/users/:username', getUserByUsername);

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
app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Invalid Url' });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal server error' });
});
module.exports = app;
