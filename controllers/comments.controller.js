const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentById,
  updateCommentById,
} = require('../models/comments.model');

const {
  checkArticleIdExist,
  checkCommentIdExist,
} = require('../db/utils/index');
const { request } = require('express');

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
