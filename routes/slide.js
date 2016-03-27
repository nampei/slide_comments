'use strict';

const express = require('express');
var router = express.Router();

// const
var TYPE = require('../const/type');

router.get('/:room/:type(' + TYPE.HOST + '|' + TYPE.GUEST + ')', function(req, res) {
  res.render('slide', {
    room: req.params.room,
    type: req.params.type
  });
});

module.exports = router;
