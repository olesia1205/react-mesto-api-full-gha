require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralErrorHandler = require('./errors/CentralErrorHandler');

const MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();

mongoose.connect(MONGO_URL, {});
app.use(cors());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);

async function connect() {
  try {
    await app.listen(process.env.PORT || 3000);
    console.log(`Server listen port ${process.env.PORT}`);
  } catch (e) {
    console.log(e);
  }
}

connect();
