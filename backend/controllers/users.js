const http2 = require('node:http2');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

const SOLT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(OK).send(user))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id пользователя'));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации полей'));
        return;
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации поля'));
        return;
      }
      next(err);
    });
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });
    if (newUser) {
      const user = newUser.toObject();
      delete user.password;
      res.status(CREATED).send(user);
      return;
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Не валидные почта или пароль'));
    } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new ConflictError('Такой пользователь уже существует'));
    } else {
      next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError('Неправильные почта или пароль'));
      return;
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      next(new BadRequestError('Неправильные почта или пароль'));
      return;
    }

    const JWT = await generateToken({ _id: user._id });

    res.status(OK).send({ token: JWT });
    return;
  } catch (err) {
    next(err);
  }
};
