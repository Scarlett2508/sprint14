const routes = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { createCard, getCards, deleteCard } = require('../controllers/cards');

const validUrl = (link) => {
  if (!validator.isURL(link)) {
    throw new Error('Неправильный формат ссылки');
  }
  return link;
};


routes.get('/cards', getCards);
routes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validUrl),
  }),
}), createCard);
routes.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

module.exports = routes;
