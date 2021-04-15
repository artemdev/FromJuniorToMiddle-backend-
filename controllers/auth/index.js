const jwt = require('jsonwebtoken');
const Users = require('../../model/users');
const { httpCode } = require('../../helpers/constants');
const mongoose = require('mongoose');
// const uuid = require('uuid/v4');
require('dotenv').config();

// const { secret } = process.env.JWT;
const SECRET_KEY = process.env.JWT_SECRET;
console.log('SECRET>>>>>>>>', process.env.JWT);
const authHelper = require('../../helpers/authHelper');

const updateToken = userId => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();
  return authHelper.replaceDbRefreshToken(refreshToken.id, userId).then(() => ({
    accessToken,
    refreshToken: refreshToken.token,
  }));
};
const Token = mongoose.model('Token');

const reg = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUser = await Users.findByEmail(email);
    if (currentUser) {
      return res.status(httpCode.CONFLICT).json({
        status: 'error',
        code: httpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use',
      });
    }

    const newUser = await Users.create(req.body);

    // const userId = newUser.id;
    // const token = updateToken(userId).then(tokens => res.json(tokens));
    // // const payload = { id };
    // // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });

    const id = newUser.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);

    return res.status(httpCode.CREATED).json({
      status: 'success',
      code: httpCode.CREATED,
      data: {
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
        token,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(httpCode.BAD_REQUEST).json({
      message: 'Ошибка от Joi или другой валидационной библиотеки',
    });
  }
};

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);
    if (payload.type !== 'refresh') {
      res.status(httpCode.BAD_REQUEST).json({ message: 'Invalid token!' });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(httpCode.BAD_REQUEST).json({ message: 'Token expired!' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(httpCode.BAD_REQUEST).json({ message: 'Invalid token!' });
    }
  }
  Token.findOne({ tokenId: payload.id })
    .exec()
    .then(token => {
      if (token === null) {
        throw new Error('Invalid token');
      }
      return updateToken(token.userId);
    })
    .then(tokens => res.json(tokens))
    .catch(error =>
      res.status(httpCode.BAD_REQUEST).json({ message: error.message }),
    );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const validPassword = await user.validPassword(password);
    if (!user || !validPassword) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: 'error',
        code: httpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }
    const userId = user._id;
    // const payload = { id };
    // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    const token = updateToken(userId).then(tokens => res.json(tokens));
    await Users.updateToken(userId, token);
    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      data: {
        token,
        email: user.email,
        name: user.name,
      },
    });
  } catch (e) {
    res.status(httpCode.UNAUTHORIZED).json({
      message: 'Email or password is wrong',
    });
  }
};

const logout = async (req, res) => {
  const id = req.user.id;
  Users.updateToken(id, null);
  return res.status(httpCode.NO_CONTENT).json({ message: 'Nothing' });
};

const currentUser = async (req, res) => {
  const token = req.get('Authorization')?.split(' ')[1];
  const { email, name, avatar } = await Users.findByToken(token);
  return res.status(httpCode.OK).json({
    status: httpCode.OK,
    data: {
      email,
      name,
      avatar,
      token,
    },
  });
};

module.exports = {
  reg,
  login,
  logout,
  currentUser,
  refreshTokens,
};
