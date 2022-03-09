const {
  selectArticleById,
  updateArticleById,
  deleteArticleById,
  selectArticles,
  insertArticle,
} = require("../models/articles.model");

const { selectTopics } = require("../models/topics.model");

const { getArticlesColumn, checkArticleIdExist } = require("../db/utils/index");

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not Found" });
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

  updateArticleById(article_id, votes)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  return getArticlesColumn()
    .then((articlesColumn) => {
      const validSortBy = articlesColumn;
      const validOrder = ["ASC", "DESC"];
      const validTopic = ["mitch", "paper", "cats"];
      // get the array of topic slug
      return selectTopics()
        .then((topics) => {
          const validTopic = topics.map((topic) => {
            return topic.slug;
          });

          const queries = req.query;
          //set by default these queries

          if (!queries.sort_by) queries.sort_by = "created_at";
          if (!queries.order) queries.order = "DESC";

          if (
            !validSortBy.includes(queries.sort_by) ||
            !validOrder.includes(queries.order.toUpperCase())
          )
            return Promise.reject({ status: 400, msg: "Invalid query" });

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

exports.postArticles = (req, res, next) => {
  console.log(req.body);
  const reqBody = req.body;
  const requestProperty = Object.keys(reqBody);
  const reqProperty = ["body", "author", "title", "topic"];

  //Checking if request body property is missing field
  if (requestProperty.length !== reqProperty.length) {
    next({ status: 400, msg: "Bad Request" });
  }

  //Checking if there is any mispelled on the property
  const isMispelled = requestProperty.map((property) => {
    return reqProperty.includes(property);
  });
  if (isMispelled.includes(false)) {
    next({ status: 400, msg: "Bad Request" });
  }
  insertArticle(reqBody)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  return checkArticleIdExist(article_id)
    .then((isArticleExist) => {
      if (isArticleExist) {
        deleteArticleById(article_id)
          .then((result) => {
            res.status(204).end();
          })
          .catch((err) => next(err));
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    })
    .catch((err) => next(err));
};
