const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const uuid = require('uuid');
require('dotenv').config();
const { tokens, secret } = process.env.JWT;

const Token = mongoose.model('Token');

const generateAccessToken = userId => {
  const payload = {
    userId,
    type: tokens.access.type,
  };
  const options = { expiresIn: tokens.access.expiresIn };
  return jwt.sign(payload, secret, options);
};
const generateRefreshToken = () => {
  const payload = {
    userId: uuid(),
    type: tokens.refresh.type,
  };
  const options = { expiresIn: tokens.refresh.expiresIn };
  return jwt.sign(payload, secret, options);
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
