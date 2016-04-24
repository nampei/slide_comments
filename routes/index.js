'use strict';

const express = require('express');
var router = express.Router();
var slide = require('../db/slide');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'index',
    all_slides: slide.getAllSlides()
  });
  var all_slides = slide.getAllSlides();
  console.log("all_slides=",all_slides);
});

module.exports = router;
