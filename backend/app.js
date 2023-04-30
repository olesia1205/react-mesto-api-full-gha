require('dotenv').config();
const http2 = require('node:http2');
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb';
const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

const app = express();

mongoose.connect(MONGO_URL, {});
app.use(cors());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required().alphanum(),
  }),
}), login);

app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({ message: statusCode === SERVER_ERROR ? 'Произошла ошибка на сервере' : message });
  next();
});

async function connect() {
  try {
    await app.listen(process.env.PORT || 3000);
    // console.log(`Server listen port ${process.env.PORT}`);
  } catch (e) {
    console.log(e);
  }
}

connect();
