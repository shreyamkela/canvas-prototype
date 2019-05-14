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
      Model.userDetails.findOne(
        {
          email: jwt_payload.email
        },
        (err, res) => {
          if (res) {
            var user = res;
            delete user.password;
          }
        }
      );
    })
  );
};
