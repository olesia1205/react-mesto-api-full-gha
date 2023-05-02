const express = require('express');

const router = express.Router();
const {
  getUsers, getMe, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');
const { validateUpdateUser, validateUpdateAvatar, validateUserId } = require('../utils/requestValidation');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', express.json(), validateUpdateUser, updateUser);
router.patch('/me/avatar', express.json(), validateUpdateAvatar, updateAvatar);

module.exports = router;
