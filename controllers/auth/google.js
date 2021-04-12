const jwt = require('jsonwebtoken');
const queryString = require('query-string');
const axios = require('axios');
const Users = require('../../model/users');
const { createFromGoogle, findByEmail } = require('../../model/users');
const { httpCode } = require('../../helpers/constants');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

exports.googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BACKEND_BASE_URL}/auth/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
  );
};

exports.googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;

  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  });

  const userData = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  try {
    const user = await findByEmail(userData.data.email);
    if (await user) {
      const id = await user._id;
      const payload = { id };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
      await Users.updateToken(id, token);
      return res.redirect(
        `${process.env.FRONTEND_BASE_URL}/auth/google/?accessToken=${token}`,
      );
    }

    const googleUser = await createFromGoogle(userData.data);
    const id = await googleUser.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);

    return res.redirect(
      `${process.env.FRONTEND_BASE_URL}/auth/google/?accessToken=${token}`,
    );
  } catch (error) {
    console.log(error);
    res.status(httpCode.BAD_REQUEST).json({
      message: 'Ошибка от Joi или другой валидационной библиотеки',
    });
  }
};