//Route to handle Get Request Call to show grade for an assignment or a quiz of a student, for a particular course
const express = require("express");
const router = express.Router();
const db = require("../database/mongoose");

router.get("/", function(req, res) {
  console.log("Get an assignment/quiz grade data called!");

  // ANCHOR
  let gradeData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM grade WHERE Email = '${gradeData.email}' AND CourseId = '${gradeData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Grade data for this Email and Course Id:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Post Request Call to grade an assignment or a quiz or a particular student, by a faculty
router.post("/", function(req, res) {
  console.log("Grade an assignment/quiz data posted!");
  // ANCHOR
  let gradeData = req.body.data;

  // gradeData.type defines whether the submission is an assignment or a quiz
  db.query(
    `INSERT INTO grade (Email, CourseId, StduentEmail, Grade, Name, Type) VALUES ('${gradeData.email}','${gradeData.courseId}','${
      gradeData.studentEmail
    }','${gradeData.grade}', '${gradeData.name}', '${gradeData.type}')`,
    err => {
      if (err) throw err;
      console.log("New details added to grade table");
      res.send("Grading Successful!");
    }
  );
});

module.exports = router;
