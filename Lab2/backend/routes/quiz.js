//Route to handle Get Request Call to show quiz submissions according to persona. If the persona is a student, this request returns the submission for a particular quiz in a particular course, and if the persona is of a faculty, this request returns only the submissions for all students for a particular quiz, in a particular course
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get Quiz Data Called!");
  // ANCHOR
  let quizData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  if (quizData.persona == 2) {
    db.query(
      `SELECT * FROM userquiz WHERE Email = '${quizData.email}' AND CourseId = '${quizData.courseId}' AND Name = '${quizData.name}'`,
      (err, results) => {
        if (err) throw err;
        if (results[0] !== undefined) {
          console.log("User quiz data for this Email:", results[0]);
          res.status(200).send(results[0]);
        } else {
          res.status(400).send();
        }
      }
    );
  } else {
    db.query(`SELECT * FROM userquiz CourseId = '${quizData.courseId}' AND Name = '${quizData.name}'`, (err, results) => {
      if (err) throw err;
      if (results[0] !== undefined) {
        console.log("All students quiz data for this course and quiz:", results);
        res.status(200).send(results[0]);
      } else {
        res.status(400).send();
      }
    });
  }
});

//Route to handle Post Request Call to create a new quiz if the persona is of a faculty, and submit an quiz, if the persona is of a student.
router.post("/", function(req, res) {
  console.log("Create/Submit Quiz Data Posted!");
  // ANCHOR
  let quizData = req.body.data;
  if (quizData.persona == 2) {
    db.query(
      `INSERT INTO userquiz (Email, CourseId, Options, Name) VALUES ('${quizData.email}','${quizData.courseId}', '${quizData.options}', '${
        quizData.name
      }')`,
      err => {
        if (err) throw err;
        console.log("New details added to user quiz table");
        res.send("Submission Successful!");
      }
    );
  } else if (quizData.persona == 1) {
    db.query(
      `INSERT INTO quiz (Email, CourseId, Questions, Options, Answers) VALUES ('${quizData.email}','${quizData.courseId}','${quizData.questions}', '${
        quizData.options
      }'),'${quizData.answers}'`,
      err => {
        if (err) throw err;
        console.log("New details added to quiz table");
        res.send("Creation Successful!");
      }
    );
  }
});

module.exports = router;
