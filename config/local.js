'use strict';

let config = {};

config.oauth = {
  facebook: {
    clientID: '511983928974510',
    clientSecret: '250309f5a786df2c8b82203578df2eb6',
    callbackURL: "http://localhost:8080/auth/callback",
    scope: ['email', 'user_friends', 'user_birthday', 'user_location']
  }
}

module.exports = config;
