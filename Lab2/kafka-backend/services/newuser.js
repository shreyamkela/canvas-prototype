//Route to handle Post Request Call to add a new user
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10; // for bcrypt

router.post("/", function(req, res) {
  console.log("New User Details Posted!");
  let newUserDetails = req.body;
  let firstname = newUserDetails.data.firstname;
  let lastname = newUserDetails.data.lastname;
  let email = newUserDetails.data.email;
  let password = newUserDetails.data.password;
  let persona = newUserDetails.data.persona;
  console.log("Firstname, Lastname, Email, Unhashed Password, Persona: ", firstname, lastname, email, password, persona);
  // Using an SQL quesy, check if Email is already present. If email not present then register, else show warning

  Model.userDetails.findOne(
    {
      email: email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user details.", err);
      } else {
        if (user) {
          console.log("Email already registered!");
          res.status(400).send("Email already registered!"); // Bad request - Catch this error at frontend axios
        } else {
          // Hashing the password
          const hashedPassword = bcrypt.hashSync(password, saltRounds);
          var id = mongoose.Types.ObjectId();

          var user = new Model.userDetails({
            profileId: id,
            email: email,
            password: hashedPassword,
            persona: persona,
            firstName: firstname,
            lastName: lastname,
            aboutMe: null,
            gender: null,
            contactNumber: null,
            city: null,
            country: null,
            company: null,
            school: null,
            hometown: null,
            languages: null,
            profileImage: null,
            createdCourses: [],
            enrolledCourses: [],
            waitlistedCourses: [],
            permissionNumbers: [],
            grades: {},
            messages: []
          });
        }
        user.save().then(
          doc => {
            console.log("User saved successfully.", doc);

            res.status(200).send("Registration Successful!"); // status should come before send
          },
          err => {
            console.log("Unable to save user details.", err);
          }
        );
      }
    }
  );
});

module.exports = router;
