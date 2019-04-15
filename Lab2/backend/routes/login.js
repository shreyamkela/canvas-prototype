//Route to handle Post Request Call to login an existing user
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.post("/", function(req, res) {
  console.log("Login Data Posted!");
  let loginData = req.body;
  let email = loginData.data.email;
  let password = loginData.data.password;
  console.log("email & Unhashed Password: ", email, password);

  kafka.make_request("login", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user details.", err);
    } else {
      if (result) {
        switch (result.persona) {
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
        console.log("Email does not exist!");
        res.send("Email does not exist!");
      }
    }
  });
});

module.exports = router;
