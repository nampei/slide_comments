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
router.get('/:room/markdown/:version', function(req, res) {

  var version = req.params.version;

  if (version === 'latest') {
    // TODO get latest data from redis
    res.send('# latest');
  } else if (!isNaN(parseFloat(version)) && isFinite(version)) {
    // TODO get old data from redis
    res.send('# notlatest');
  } else {
    res.send('# Opps!We have some problem!');
  }
});

module.exports = router;
