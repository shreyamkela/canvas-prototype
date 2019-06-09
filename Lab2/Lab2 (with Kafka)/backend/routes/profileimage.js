//Route to handle Get Request Call to get the profile picture
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get profile image!");
  kafka.make_request("profileimage", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user", err);
    } else {
      if (result) {
        res.status(200).sendFile(__dirname + `${result.profileImage.Path}`);
      } else {
        console.log("Unable to fetch profile image", err);
        res.status(400).send();
      }
    }
  });
});

//Route to handle Post Request Call to post/upload the profile picture
router.post("/", function(req, res) {
  console.log("Post/Upload profile image!");
  // ANCHOR
  kafka.make_request("profileimage", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user", err);
    } else {
      if (result) {
        res.send("Creation Successful!");
      } else {
        res.status(400).send();
      }
    }
  });
});

module.exports = router;
