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
  const { id } = req.params;
  Card.findById(id).populate('owner')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Not Found' });
      }
      if (card.owner._id.toString() !== req.user._id) {
        return res.status(403).send({ message: 'Forbidden/Доступ запрещён' });
      }
      res.send({ data: card });
      return card.remove();
    })
    .catch((err) => {
      if (err.name === err.ValidationError) {
        return res.status(400).send({ message: 'Bad request' });
      }
      return res.status(500).send({ message: err.message });
    });
};
