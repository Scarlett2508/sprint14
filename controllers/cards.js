const Card = require('../models/cards');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === err.ValidationError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('card')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(404).send({ message: 'Not Found' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId).populate('owner')
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Not Found' });
      }
      if (toString(card.owner) !== toString(req.user._id)) {
        return res.status(403).send({ message: 'Forbidden/Доступ запрещён' });
      }
      return Card.findByIdAndRemove(cardId)
        .then(() => res.send({ card }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Bad request' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};
