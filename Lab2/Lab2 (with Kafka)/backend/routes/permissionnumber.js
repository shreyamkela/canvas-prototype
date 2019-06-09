//Route to handle Get Request Call show all students that are on the waitlist and require permission numbers, for a particular course
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get waitlist/permission number data!");
  // ANCHOR
  kafka.make_request("permissionnumber", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch course", err);
    } else {
      if (result) {
        console.log("Waitlist detail: ", result);
        res.status(200).send(result.waitlistedStudents);
      } else {
        res.status(400).send();
      }
    }
  });
});

//Route to handle Post Request Call to provide permission number to select students that are on the waitlist, for a particular course
//When a student a selected for permission number, we enroll them in the course. No extra functionality specified in the problem statement.
router.post("/", function(req, res) {
  console.log("Post permission number data!");
  // ANCHOR
  kafka.make_request("permissionnumber", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch course", err);
    } else {
      if (result) {
        res.send("Addition Successful!");
      } else {
        res.status(400).send();
      }
    }
  });
});

module.exports = router;
