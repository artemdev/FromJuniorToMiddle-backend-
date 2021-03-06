const express = require('express');
const router = express.Router();
const guard = require('../../helpers/guard');
const { reg, login, logout, currentUser } = require('../../controllers/auth');
const tryCatchWrapper = require('../../helpers/try-catch-wrapper');
const { googleAuth, googleRedirect } = require('../../controllers/auth/google');

router.get('/google', tryCatchWrapper(googleAuth));
router.get('/google-redirect', tryCatchWrapper(googleRedirect));

router.post('/register', reg);
router.post('/login', login);
router.post('/logout', guard, logout);
router.get('/user', guard, currentUser);
module.exports = router;
