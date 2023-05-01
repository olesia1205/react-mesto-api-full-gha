const http2 = require('node:http2');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .sort({ createdAt: -1 })
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => {
      card.populate(['owner'])
        .then(() => res.status(CREATED).send(card));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации полей'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (`${card.owner}` !== req.user._id) {
        throw new ForbiddenError('Нет доступа на удаление чужой карточки');
      }
      return Card.deleteOne(card)
        .then(() => res.status(OK).send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id карточки'));
        return;
      }
      next(err);
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id карточки'));
        return;
      }
      next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id карточки'));
        return;
      }
      next(err);
    });
};
