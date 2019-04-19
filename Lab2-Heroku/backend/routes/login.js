//Route to handle Post Request Call to login an existing user
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");
const bcrypt = require("bcrypt");
//Passport authentication
var passport = require("passport");
var jwt = require("jsonwebtoken");

const saltRounds = 10; // for bcrypt

// Set up middleware
var requireAuth = passport.authenticate("jwt", { session: false });
const secret = "cmpe273-secret";

router.post("/", function(req, res) {
  console.log("Login Data Posted!");
  let loginData = req.body;
  let email = loginData.data.email;
  let password = loginData.data.password;
  console.log("email & Unhashed Password: ", email, password);

  Model.userDetails.findOne(
    {
      email: email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user details.", err);
        res.status(400).send("Unable to fetch user details.");
      } else {
        if (user) {
          console.log("User details: ", user);
          if (!bcrypt.compareSync(password, user.password)) {
            console.log("Incorrect password!");
            res.status(400).send("Incorrect password!");
          } else {
            let persona = user.persona;
            console.log("Persona: ", persona);
            res.cookie("cookie", "LoggedIn", {
              // Set the name 'cookie' to the cookie sent to client, when admin logs in. At react/client end, we can check whether the name is 'cookie' or not, to authenticate.
              // At react/client end, we check the cookie name using cookie.load('cookie') command of the 'react-cookies' library. If cookie.load('cookie') != null this means that the user is admin
              maxAge: 900000,
              httpOnly: false,
              path: "/"
            });
            switch (persona) {
              case "1":
                console.log("Faculty Login Successful!");
                res.status(200).send("Faculty Login Successful!");
                break;
              case "2":
                console.log("Student Login Successful!");
                res.status(200).send("Student Login Successful!");
                break;
            }
          }
        } else {
          console.log("Email does not exist!");
          res.status(400).send("Email does not exist!");
        }
      }
    }
  );
});

module.exports = router;
