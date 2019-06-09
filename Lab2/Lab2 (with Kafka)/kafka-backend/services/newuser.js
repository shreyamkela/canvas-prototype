const Model = require("../database/connection");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10; // for bcrypt

function handle_request(message, callback) {
  console.log("New User Details Posted!");
  let newUserDetails = message;
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
    (err, result) => {
      if (err) {
        console.log("Unable to fetch user details.", err);
        callback(err, null);
      } else {
        if (result) {
          console.log("Email already registered!");
          callback("Email already registered!", null);
        } else {
          // Hashing the password
          const hashedPassword = bcrypt.hashSync(password, saltRounds);
          var id = mongoose.Types.ObjectId();

          var result = new Model.userDetails({
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
        result.save().then(
          doc => {
            console.log("User saved successfully.", doc);
            callback("Registration Successful!", result);
          },
          err => {
            console.log("Unable to save user details.", err);
            callback(err, null);
          }
        );
      }
    }
  );
}

exports.handle_request = handle_request;
