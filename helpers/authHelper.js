const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const mongoose = require('mongoose');
const uuid = require('uuid');
require('dotenv').config();
// const { tokens, secret } = process.env.JWT;
const JWT_SECRET = process.env.JWT_SECRET;
console.log('AUTH>>>>>>>>>>>>>'.secret);

const Token = mongoose.model('Token');
=======
// const mongoose = require('mongoose');
// const Token = mongoose.model('Token');

const Token = require('../model/token');
const uuid = require('uuid');

const { tokens, secret } = require('../config/app').JWT;
>>>>>>> 8ec4c7bc473e4d152c84be481fcb4e950cedb405

const generateAccessToken = userId => {
  const payload = {
    userId,
<<<<<<< HEAD
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
=======
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
>>>>>>> 8ec4c7bc473e4d152c84be481fcb4e950cedb405
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
