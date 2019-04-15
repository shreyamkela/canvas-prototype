//Route to handle Get Request Call to load all details of profile
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get Profile Data Called!");
  kafka.make_request("profile", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user", err);
    } else {
      if (result) {
        console.log("User details: ", result);
        res.status(200).send(result);
      } else {
        res.status(400).send();
      }
    }
  });
});

router.post("/", function(req, res) {
  console.log("Edit Profile Data Posted!");
  let profileData = req.body.data;
  console.log(profileData);
  kafka.make_request("profile", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user", err);
    } else {
      if (user) {
        res.send("Addition Successful!");
      } else {
        res.status(400).send();
      }
    }
  });
});

module.exports = router;
