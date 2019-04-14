//Route to handle Post Request Call to login an existing user
const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const bcrypt = require("bcrypt");

const saltRounds = 10; // for bcrypt

router.post("/", function(req, res) {
  console.log("Login Data Posted!");
  let loginData = req.body;
  let email = loginData.data.email;
  let password = loginData.data.password;
  console.log("email & Unhashed Password: ", email, password);

  // Hashing the input password so that it can be compared with the hashed password stored in the db for this email - BUT THIS DOESNT WORK AS EVEN IF THE PASSWORD IS SAME< IF WE USE bcrypt.hash, THE SALT WOULD BE DIFFERENT AND THEREFORE HASHED VERSION WOULD BE DIFFERENT
  // let hashedPassword = null;
  // bcrypt.hash(password, saltRounds, function(err, hash) {
  //   if (err) throw err;
  //   hashedPassword = hash;
  //   console.log(hashedPassword, hash);
  // });

  // Using an SQL query, check if Email and password is present
  // db.query(`SELECT Persona FROM Users WHERE Email = '${email}' AND BINARY Password = '${password}'`, (err, results) => {
  // Checking for password already present should be case sensitive - The password's case should also match - For this we use the keyword BINARY - https://stackoverflow.com/questions/5629111/how-can-i-make-sql-case-sensitive-string-comparison-on-mysql
  db.query(`SELECT Password, Persona FROM Users WHERE Email = '${email}' `, (err, results) => {
    if (err) throw err;
    console.log(results);
    if (results[0] !== undefined) {
      // if email present
      bcrypt.compare(password, results[0].Password, function(err, comparisonResult) {
        if (comparisonResult == true) {
          // If password correct
          let persona = results[0].Persona;
          console.log("Persona: ", persona);
          res.cookie("cookie", "LoggedIn", {
            // Set the name 'cookie' to the cookie sent to client, when admin logs in. At react/client end, we can check whether the name is 'cookie' or not, to authenticate.
            // At react/client end, we check the cookie name using cookie.load('cookie') command of the 'react-cookies' library. If cookie.load('cookie') != null this means that the user is admin
            maxAge: 900000,
            httpOnly: false,
            path: "/"
          });
          switch (persona) {
            case 1:
              console.log("Faculty Login Successful!");
              res.send("Faculty Login Successful!");
              break;
            case 2:
              console.log("Student Login Successful!");
              res.send("Student Login Successful!");
              break;
          }
        } else {
          console.log("Incorrect password!");
          res.send("Incorrect password!");
        }
      });
    } else {
      console.log("Email does not exist!");
      res.send("Email does not exist!");
    }
  });
});

module.exports = router;
