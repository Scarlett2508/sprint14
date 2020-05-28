const Card = require('../models/cards');

module.exports.createCard = (req, res) => {
  // eslint-disable-next-line no-console
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};


module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('card')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cardRemove) => res.send({ remove: cardRemove }))
          .catch(() => res.status(500).send({ message: 'Ошибка' }));
      } else {
        res.status(404).send({ message: 'Ошибка' });
      }
    })
    .catch(() => res.status(404).send({ message: 'Ошибка' }));
};
