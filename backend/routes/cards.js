const express = require('express');

const router = express.Router();
const {
  getCards, deleteCard, createCard, putLike, deleteLike,
} = require('../controllers/cards');

const { validateCreateCard, validateCardId } = require('../utils/requestValidation');

router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCard);
router.post('/', express.json(), validateCreateCard, createCard);
router.put('/:cardId/likes', validateCardId, putLike);
router.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
