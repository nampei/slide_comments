'use strict';

const express = require('express');
var router = express.Router();

// const
var TYPE = require('../const/type');

// slide
router.get('/:room/:type(' + TYPE.HOST + '|' + TYPE.GUEST + ')', function(req, res) {
  res.render('slide', {
    room: req.params.room,
    type: req.params.type
  });
});

// slide get
router.get('/:room/markdown', function(req, res) {
  // TODO get data from redis
  res.send('# test \n ## testffffff');
});

module.exports = router;
