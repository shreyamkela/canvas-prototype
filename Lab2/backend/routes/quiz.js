//Route to handle Get Request Call to show quiz submissions according to persona. If the persona is a student, this request returns the submission for a particular quiz in a particular course, and if the persona is of a faculty, this request returns only the submissions for all students for a particular quiz, in a particular course
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get Quiz Data Called!");
  kafka.make_request("quiz", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch cours", err);
    } else {
      if (result) {
        console.log("Quizzes detail: ", result);
        res.status(200).send(result.quizzes);
      } else {
        res.status(400).send();
      }
    }
  });
});

//Route to handle Post Request Call to create a new quiz if the persona is of a faculty, and submit an quiz, if the persona is of a student.
router.post("/", function(req, res) {
  console.log("Create/Submit Quiz Data Posted!");
  // ANCHOR
  let quizData = req.body.data;
  if (quizData.persona == 2) {
    kafka.make_request("quiz", req, function(err, result) {
      if (err) {
        console.log("Unable to fetch course", err);
      } else {
        if (result) {
          res.status(200).send();
        } else {
          res.status(400).send();
        }
      }
    });
  } else if (quizData.persona == 1) {
    kafka.make_request("quiz", req, function(err, result) {
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
  }
});

module.exports = router;
