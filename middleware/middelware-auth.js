const jwt = require('jsonwebtoken');
require('dotenv').config();
const { secret } = process.env.JWT;
const { httpCode } = require('../helpers/constants');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(httpCode.UNAUTHORIZED).json({ message: 'Token not provided!' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, secret);
    if (payload.type !== 'access') {
      res.status(httpCode.UNAUTHORIZED).json({ message: 'Invalid token!' });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(httpCode.UNAUTHORIZED).json({ message: 'Token expired!' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(httpCode.UNAUTHORIZED).json({ message: 'Invalid token!' });
    }
  }
};
