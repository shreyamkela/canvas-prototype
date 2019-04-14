"use strict";
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var Model = require("../config/passport");
const secret = "canvas-secret";

// JWT passport strategy export
module.exports = function(passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
  };
  passport.use(
    new JwtStrategy(opts, function(jwt_payload, callback) {
      Model.Userdetails.findOne(
        {
          Username: jwt_payload.Username
        },
        (err, res) => {
          if (res) {
            var user = res;
            delete user.Password;
            callback(null, user);
          } else {
            callback(err, false);
          }
        }
      );
    })
  );
};
