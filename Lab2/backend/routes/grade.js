//Route to handle Get Request Call to show grade for an assignment or a quiz of a student, for a particular course
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get an assignment/quiz grade data called!");

  // ANCHOR
  kafka.make_request("grade", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user", err);
    } else {
      if (result) {
        console.log("Grades detail: ", result);
        res.status(200).send(result.grades);
      } else {
        res.status(400).send();
      }
    }
  });
});

//Route to handle Post Request Call to grade an assignment or a quiz or a particular student, by a faculty
router.post("/", function(req, res) {
  console.log("Grade an assignment/quiz data posted!");
  // ANCHOR
  // gradeData.type defines whether the submission is an assignment or a quiz

  kafka.make_request("grade", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user", err);
    } else {
      if (result) {
        res.status(200).send();
      } else {
        res.status(400).send();
      }
    }
  });
});

module.exports = router;
