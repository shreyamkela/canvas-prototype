//Route to handle Get Request Call to show assignment submissions according to persona. If the persona is a student, this request returns all submissions for a particular assignment in a particular course, and if the persona is of a faculty, this request returns only the latest submissions for all students for a particular assignment, in a particular course
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get Assignment Data Called!");
  // ANCHOR
  kafka.make_request("assignment", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch course", err);
      res.status(400).send();
    } else {
      if (result) {
        if (result.persona == 2) {
          for (key in results) {
            res.status(200).sendFile(__dirname + `${result.assignments[key].Path}`);
          }
        } else if (result.persona == 1) {
          res.status(200).sendFile(__dirname + `${result.assignments[0].Path}`);
        }
      } else {
        console.log("Unable to fetch course", err);
        res.status(400).send();
      }
    }
  });
});

//Route to handle Post Request Call to create a new assignment if the persona is of a faculty, and submit an assignment, if the persona is of a student. We dont override the the previous submissions
router.post("/", function(req, res) {
  console.log("Create/Submit Assignment Data Posted!");
  // ANCHOR
  kafka.make_request("assignment", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch course", err);
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
