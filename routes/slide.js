'use strict';

const express = require('express');
var router = express.Router();
var redis = require("redis");

var room = require('../db/room');

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

  slide_client = redis.createClient();

  var version = req.params.version;
  var room_id = req.params.room;

  if (version === 'latest') {
    // TODO get latest data from redis

    var sl = room.getLatestSlide(room_id);
    console.log('sl',sl);

    if (!sl) {
      sl = {
        'room_id':room_id,
        'version_id':1,
        'body':'#newhoge',
        'user_id':1,
        'datetime': Date.now()
      }
      room.setSlide(sl);
    }
    console.log('bbq',sl);

    res.send(sl.body);
  } else if (!isNaN(parseFloat(version)) && isFinite(version)) {
    // TODO get old data from redis
    res.send(room.getSlide(version));
  } else {
    res.send('# Opps!We have some problem!');
  }
});

module.exports = router;
