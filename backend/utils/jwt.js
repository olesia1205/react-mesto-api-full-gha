const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const JWT_DEV_SECRET = 'dev_secret-key';

module.exports.generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET, { expiresIn: '7d' });
