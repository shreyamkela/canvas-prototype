//Route to handle Post Request Call to add a new user
const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const bcrypt = require("bcrypt");

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

  db.query(`SELECT Persona FROM Users WHERE Email = '${email}'`, (err, results) => {
    if (err) throw err;
    if (results[0] === undefined) {
      // if email not present, then only register
      // Save hashed passwrod into db using bcrypt
      bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        db.query(`INSERT INTO Users (Email, Password, Persona) VALUES ('${email}','${hash}',${persona})`, (err, results) => {
          if (err) throw err;
          console.log("New details added to Users table");
        });
      });
      db.query(`INSERT INTO Profile (Email, Firstname, Lastname) VALUES ('${email}','${firstname}','${lastname}')`, err => {
        if (err) throw err;
        console.log("New details added to Profile table");
      });
      res.status(200).send("Registration Successful!"); // status should come before send
    } else {
      console.log("Email already registered!");
      res.status(400).send("Email already registered!"); // Bad request - Catch this error at frontend axios
    }
  });
});

module.exports = router;
