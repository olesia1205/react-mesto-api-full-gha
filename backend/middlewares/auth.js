const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

const JWT_DEV_SECRET = 'dev_secret-key';

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const tokenWithoutBearer = token.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(tokenWithoutBearer, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET);
  } catch (error) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
