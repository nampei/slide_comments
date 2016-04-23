'use strict';

const express = require('express');
var router = express.Router();
var redis = require("redis");

var slide = require('../db/slide');

// const
var TYPE = require('../const/type');

// slide
router.get('/:slide_id/:type(' + TYPE.HOST + '|' + TYPE.GUEST + ')', function(req, res) {
  res.render('slide', {
    slide_id: req.params.slide_id,
    type: req.params.type
  });
});

// slide get
router.get('/:slide_id/markdown/:version', function(req, res) {

  slide_client = redis.createClient();

  var version = req.params.version;
  var slide_id = req.params.slide_id;

  if (version === 'latest') {
    // TODO get latest data from redis

    var sl = slide.getLatestSlide(slide_id);
    console.log('sl',sl);

    if (!sl) {
      sl = {
        'slide_id':slide_id,
        'version_id':1,
        'body':'#newhoge',
        'user_id':1,
        'datetime': Date.now()
      }
      slide.setSlide(sl);
    }
    console.log('bbq',sl);

    res.send(sl.body);
  } else if (!isNaN(parseFloat(version)) && isFinite(version)) {
    // TODO get old data from redis
    res.send(slide.getSlide(version));
  } else {
    res.send('# Opps!We have some problem!');
  }
});

module.exports = router;
