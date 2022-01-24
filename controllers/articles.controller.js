const {
  selectArticleById,
  updateArticleById,
  selectArticles,
} = require("../models/articles.model");

const { selectTopics } = require("../models/topics.model");

const { getArticlesColumn } = require("../db/utils/index");

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
    .catch((err) => {
      next(err);
    });
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
          queries.sort_by ??= "created_at";
          queries.order ??= "DESC";

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
