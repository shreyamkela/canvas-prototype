//Route to handle Get Request Call to show all people registered for a particular course. Personas can also be save in people table and therefore, we can send faculty name as a seperate key in the json response so that it can be shown on the frontend with a faculty tag.
const express = require("express");
const router = express.Router();
const db = require("../database/mongoose");

router.get("/", function(req, res) {
  console.log("Get all people data called!");

  // ANCHOR
  let peopleData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM courseEnrolments WHERE CourseId = '${peopleData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("People data for this course id:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Post Request Call to remove a student from a course, by a faculty
router.post("/", function(req, res) {
  console.log("Remove a student from people data posted!");
  // ANCHOR
  let peopleData = req.body.data;
  // let title = peopleData.title;
  // console.log("Title: ", title);

  db.query(`DELETE FROM courseEnrolments WHERE Email = '${peopleData.email}' AND CourseId = '${peopleData.courseId}'`, err => {
    if (err) throw err;
    console.log("Removed this course for the student in courseEnrolments table");
    res.send("Removal Successful!");
  });
});

module.exports = router;
