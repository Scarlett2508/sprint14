const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, getUsers } = require('../controllers/users');


routes.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);

routes.get('/users', getUsers);

module.exports = routes;
