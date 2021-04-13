const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const uuid = require('uuid');
require('dotenv').config();
// const { tokens, secret } = process.env.JWT;
const JWT_SECRET = process.env.JWT_SECRET;
console.log('AUTH>>>>>>>>>>>>>'.secret);

const Token = mongoose.model('Token');

const generateAccessToken = userId => {
  const payload = {
    userId,
    type: refresh,
    // type: tokens.access.type,
  };
  // const options = { expiresIn: tokens.access.expiresIn };
  const options = { expiresIn: '2h' };
  return jwt.sign(payload, JWT_SECRET, options);
};
const generateRefreshToken = () => {
  const payload = {
    userId: uuid(),
    type: tokens.refresh.type,
  };
  const options = {};
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '720h' });
};

const replaceDbRefreshToken = (tokenId, userId) => {
  Token.findOneAndRemove({ userId })
    .exec()
    .then(() => Token.create({ tokenId, userId }));
};
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  replaceDbRefreshToken,
};
