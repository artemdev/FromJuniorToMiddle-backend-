const express = require('express');
const router = express.Router();
const guard = require('../../helpers/guard');

<<<<<<< HEAD
const {
  reg,
  login,
  logout,
  currentUser,
  refreshTokens,
} = require('../../controllers/auth');

// const { reg, login, logout, currentUser } = require('../../controllers/auth');
=======
const { reg, login, logout, currentUser } = require('../../controllers/auth');
>>>>>>> 8ec4c7bc473e4d152c84be481fcb4e950cedb405
const tryCatchWrapper = require('../../helpers/try-catch-wrapper');
const { googleAuth, googleRedirect } = require('../../controllers/auth/google');

router.get('/google', tryCatchWrapper(googleAuth));
router.get('/google-redirect', tryCatchWrapper(googleRedirect));


router.post('/register', reg);
router.post('/refresh-token', refreshTokens);
router.post('/login', login);
router.post('/logout', guard, logout);
router.get('/user', guard, currentUser);
module.exports = router;
