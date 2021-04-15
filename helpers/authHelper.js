const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
// const Token = mongoose.model('Token');

const Token = require('../model/token');
const uuid = require('uuid');

const { tokens, secret } = require('../config/app').JWT;

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
    id: uuid(),
    type: tokens.refresh.type,
  };
  const options = { expiresIn: tokens.refresh.expiresIn };

  return {
    id: payload.id,
    token: jwt.sign(payload, secret, options),
  };
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
