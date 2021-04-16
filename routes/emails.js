const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emails');

router.post('/', function (req, res) {
  sendEmail(req, res);
});

router.get('/', express.static('./public/email.html'));
router.get('/offer', express.static('./public/offer.html'));

module.exports = router;
