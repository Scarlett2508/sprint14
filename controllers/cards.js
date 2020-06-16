const Card = require('../models/cards');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const Error = require('../middlewares/error');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('card')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId).populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('There is no such card!');
      }
      if (toString(card.owner) !== toString(req.user._id)) {
        throw new ForbiddenError('Forbidden!');
      }
      return Card.findByIdAndRemove(cardId)
        .then(() => res.send({ card }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Bad request!');
      }
      throw new Error('Something happened');
    });
};
