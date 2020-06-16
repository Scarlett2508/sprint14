const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createCard, getCards, deleteCard } = require('../controllers/cards');


routes.get('/cards', getCards);
routes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().url(),
  }),
}), createCard);
routes.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

module.exports = routes;
