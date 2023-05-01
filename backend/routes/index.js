const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const express = require('express');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');

const urlRegExp = /^https?:\/\/(www.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*#?$/;

routes.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

routes.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required().alphanum(),
  }),
}), login);

routes.use('/users', auth, usersRouter);
routes.use('/cards', auth, cardsRouter);

routes.use('*', (req, res, next) => {
  next(new NotFoundError('По указанному url ничего нет'));
});

module.exports = routes;
