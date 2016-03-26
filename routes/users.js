'use strict';

const express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('logined', {  });
});

module.exports = router;
