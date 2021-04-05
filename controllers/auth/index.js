const jwt = require('jsonwebtoken');
const Users = require('../../model/users');
const { httpCode } = require('../../helpers/constants');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

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
    return res.status(httpCode.CREATED).json({
      status: 'success',
      code: httpCode.CREATED,
      data: {
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(httpCode.BAD_REQUEST).json({
      message: 'Ошибка от Joi или другой валидационной библиотеки',
    });
  }
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
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);
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
};
