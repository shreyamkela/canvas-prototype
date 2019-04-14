//Route to handle Get Request Call to show quiz submissions according to persona. If the persona is a student, this request returns the submission for a particular quiz in a particular course, and if the persona is of a faculty, this request returns only the submissions for all students for a particular quiz, in a particular course
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get Quiz Data Called!");
  // ANCHOR
  let quizData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  Model.courseDetails.findOne(
    {
      courseId: quizData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch cours", err);
      } else {
        if (user) {
          console.log("Quizzes detail: ", user);
          res.status(200).send(user.quizzes);
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

//Route to handle Post Request Call to create a new quiz if the persona is of a faculty, and submit an quiz, if the persona is of a student.
router.post("/", function(req, res) {
  console.log("Create/Submit Quiz Data Posted!");
  // ANCHOR
  let quizData = req.body.data;
  if (quizData.persona == 2) {
    Model.courseDetails.findOne(
      {
        courseId: quizData.courseId
      },
      (err, user) => {
        if (err) {
          console.log("Unable to fetch course", err);
        } else {
          if (user) {
            user.quizzes[quizData.email].push(quizData);
            user.save().then(
              doc => {
                console.log("New details added to this users quizzes", doc);
                res.send("Addition Successful!");
              },
              err => {
                console.log("Unable to save quiz details.", err);
                res.status(400).send();
              }
            );
          } else {
            res.status(400).send();
          }
        }
      }
    );
  } else if (quizData.persona == 1) {
    Model.courseDetails.findOne(
      {
        courseId: quizData.courseId
      },
      (err, user) => {
        if (err) {
          console.log("Unable to fetch course", err);
        } else {
          if (user) {
            user.quizzes.push(quizData);
            user.save().then(
              doc => {
                console.log("New details added to this course quizzs", doc);
                res.send("Addition Successful!");
              },
              err => {
                console.log("Unable to save quiz details.", err);
                res.status(400).send();
              }
            );
          } else {
            res.status(400).send();
          }
        }
      }
    );
  }
});

module.exports = router;
