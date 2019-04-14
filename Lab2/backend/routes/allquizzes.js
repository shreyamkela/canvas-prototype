//Route to handle Get Request Call to show quizzes created in a particular course. If persona is student, show whether an quiz is submitted or not. If the persona is faculty, show all the quizzes created.
const express = require("express");
const router = express.Router();
const db = require("../database/mongoose");

router.get("/", function(req, res) {
  console.log("Get All Quizzes Data Called!");
  // ANCHOR
  let quizData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM quiz WHERE CourseId = '${quizData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Quiz data for this course id:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

module.exports = router;
