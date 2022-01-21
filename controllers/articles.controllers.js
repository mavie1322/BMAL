const {
  selectTopics,
  selectArticleById,
  selectCommentsByArticleId,
  updateArticlesById,
  selectArticles,
  insertCommentByArticleId,
  deleteCommentById,
  selectUsers,
  selectUserByUsername,
  updateCommentById,
} = require('../models/articles.models');

const {
  checkArticleIdExist,
  checkCommentIdExist,
  getArticlesColumn,
} = require('../db/utils/index');
const { request } = require('express');

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { votes } = req.body;

  updateArticlesById(article_id, votes)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  // const validSortBy = [
  //   'author',
  //   'title',
  //   'article_id',
  //   'topic',
  //   'created_at',
  //   'votes',
  //   'comment_count',
  // ];
  return getArticlesColumn()
    .then((articlesColumn) => {
      const validSortBy = articlesColumn;
      const validOrder = ['ASC', 'DESC'];
      //get the array of topic slug
      return selectTopics()
        .then((topics) => {
          const validTopic = topics.map((topic) => {
            return topic.slug;
          });
          const queries = req.query;
          //set by default these queries
          queries.sort_by ??= 'created_at';
          queries.order ??= 'DESC';

          if (
            !validSortBy.includes(queries.sort_by) ||
            !validOrder.includes(queries.order)
          )
            next({ status: 400, msg: 'Invalid query' });

          return selectArticles(queries)
            .then((articles) => {
              res.status(200).send({ articles });
            })
            .catch((err) => {
              next(err);
            });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return checkArticleIdExist(article_id)
    .then((isArticleExist) => {
      if (isArticleExist) {
        selectCommentsByArticleId(article_id)
          .then((comments) => {
            res.status(200).send({ comments });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const reqBody = req.body;
  const requestProperty = Object.keys(reqBody);
  const reqProperty = ['body', 'username'];

  //Checking if request body property is missing field
  if (requestProperty.length !== reqProperty.length) {
    next({ status: 400, msg: 'Bad Request' });
  }

  //Checking if there is any mispelled on the property
  const isMispelled = requestProperty.map((property) => {
    return reqProperty.includes(property);
  });
  if (isMispelled.includes(false)) {
    next({ status: 400, msg: 'Bad Request' });
  }

  checkArticleIdExist(article_id)
    .then((isArticleExist) => {
      if (isArticleExist) {
        insertCommentByArticleId(article_id, reqBody)
          .then((comment) => {
            res.status(201).send({ comment });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  return checkCommentIdExist(comment_id)
    .then((isCommentExist) => {
      if (isCommentExist) {
        deleteCommentById(comment_id)
          .then((result) => {
            res.status(204).end();
          })
          .catch((err) => {
            next(err);
          });
      } else {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  const { username } = req.params;
  selectUsers(username)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { votes } = req.body;
  return checkCommentIdExist(comment_id)
    .then((isCommentExist) => {
      if (isCommentExist) {
        updateCommentById(comment_id, votes)
          .then((comment) => {
            res.status(200).send({ comment });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};
