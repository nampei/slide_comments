'use strict';

const config = require('../config/local');
const FacebookStrategy = require('passport-facebook').Strategy;
var user_db = require('../db/user');

let initPassport = function(passport) {
  passport.use(new FacebookStrategy(config.oauth.facebook, (accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    process.nextTick(() => {
      return done(null, profile);
    });
  }));

  passport.serializeUser((user, done) => {
    console.log("id=", user.id);
    console.log("username=", user.displayName);
    done(null, user);
    u = {
      'user_id': user.id,
      'user_name': user.displayName,
      'user_type': 'super'
    }
    user_db.set_user(u)

  });

  passport.deserializeUser((obj, done) =>{
    done(null, obj);
  });
};

module.exports = initPassport;
