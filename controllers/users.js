const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ThrowError = require('../middlewares/throwError');
const { PrivateKey } = require('../config');


module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(new NotFoundError('Список пользователей пуст'))
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Validation error');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Bad request');
      }
      // eslint-disable-next-line eqeqeq
      if (err.code == '11000') {
        throw new ConflictError('User already exists');
      }
      throw new ThrowError('Something happened');
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new BadRequestError('This user doesn not exist!'))
    .then((user) => {
      if (!user) {
        throw new BadRequestError('This user doesn not exist!');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .orFail(new UnauthorizedError('Неправильный email или пароль'))
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, PrivateKey, { expiresIn: '7d' }),
      });
    })
    .catch(next);
};
