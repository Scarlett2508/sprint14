const Card = require('../models/cards');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

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

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).populate('owner')
    .orFail(() => {
      throw new NotFoundError('There is no such card!');
    })
    .then((card) => {
      if (toString(card.owner._id) !== toString(req.user._id)) {
        throw new ForbiddenError('Forbidden!');
      }
      return Card.findByIdAndRemove(cardId)
        .then(() => res.send({ card }));
    })
    .catch(next);
};
