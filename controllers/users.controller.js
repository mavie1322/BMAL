const { selectUsers, selectUserByUsername } = require('../models/users.model');

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
