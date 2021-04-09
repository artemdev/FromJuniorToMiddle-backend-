const express = require('express');
const router = express.Router();

router.post('/emails', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
