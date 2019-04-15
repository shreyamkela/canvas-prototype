const Model = require("../database/connection");
const bcrypt = require("bcrypt");
//Passport authentication
var passport = require("passport");
var jwt = require("jsonwebtoken");

const saltRounds = 10; // for bcrypt

// Set up middleware
var requireAuth = passport.authenticate("jwt", { session: false });
const secret = "cmpe273-secret";

function handle_request(message, callback) {
  Model.userDetails.findOne(
    {
      email: message.email
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch user details.", err);
        callback(err, null);
      } else {
        if (result) {
          console.log("User details: ", result);
          if (!bcrypt.compareSync(message.password, result.password)) {
            console.log("Incorrect password!");
            callback("Incorrect password!", null);
          } else {
            let persona = result.persona;
            console.log("Persona: ", persona);
            switch (persona) {
              case 1:
                console.log("Faculty Login Successful!");
                callback("Faculty Login Successful!", result);
                break;
              case 2:
                console.log("Student Login Successful!");
                callback("Student Login Successful!", result);
                break;
            }
          }
        } else {
          console.log("Email does not exist!");
          callback("Email does not exist!", null);
        }
      }
    }
  );
}

exports.handle_request = handle_request;
