const routes = require('express').Router();
const { createCard, getCards, deleteCard } = require('../controllers/cards');

routes.get('/cards', getCards);
routes.post('/cards', createCard);
routes.delete('/cards/:cardId', deleteCard);

module.exports = routes;
