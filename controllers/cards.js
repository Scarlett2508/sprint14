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
    .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
};

// eslint-disable-next-line consistent-return
module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId)
      .orFail(() => res.status(404).send({ message: 'Карточка не найдена' }));
    if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
      throw new Error({ message: 'Так нельзя' });
    }
    res.send({ data: card });
    return card.remove();
  } catch (err) {
    res.status(500).send({ message: 'Не удалось удалить карточку' });
  }
};
