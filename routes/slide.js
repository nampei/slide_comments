'use strict';

const express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
    room: req.params.room,
    type: req.params.type
  });
});

module.exports = router;
