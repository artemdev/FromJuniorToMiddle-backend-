const express = require('express');
const router = express.Router();
const guard = require('../../helpers/guard');
const {
  reg,
  login,
  logout,
  currentUser,
  refreshTokens,
} = require('../../controllers/auth');

router.post('/register', reg);
router.post('/refresh-token', refreshTokens);
router.post('/login', login);
router.post('/logout', guard, logout);
router.get('/user', guard, currentUser);
module.exports = router;
