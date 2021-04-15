require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  JWT: {
    secret: JWT_SECRET,
    tokens: {
      access: {
        type: 'access',
        expiresIn: '2h',
      },
      refresh: {
        type: 'refresh',
        expiresIn: '720h',
      },
    },
  },
};
