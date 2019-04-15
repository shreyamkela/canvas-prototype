//Route to handle Post Request Call to add a new user
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.post("/", function(req, res) {
  console.log("New User Details Posted!");
  kafka.make_request("newuser", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user details.", err);
    } else {
      if (user) {
        console.log("Email already registered!");
        res.status(400).send("Email already registered!"); // Bad request - Catch this error at frontend axios
      } else {
        res.status(200).send("Email registered!");
      }
    }
  });
});

module.exports = router;
