const http2 = require('node:http2');

const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

const centralErrorHandler = ((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({ message: statusCode === SERVER_ERROR ? 'Произошла ошибка на сервере' : message });
  next();
});

module.exports = centralErrorHandler;
