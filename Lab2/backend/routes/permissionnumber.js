//Route to handle Get Request Call show all students that are on the waitlist and require permission numbers, for a particular course
const express = require("express");
const router = express.Router();
const db = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get waitlist/permission number data!");
  // ANCHOR
  let waitlistData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM waitlist WHERE CourseId = '${waitlistData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("waitlist data for this course:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Post Request Call to provide permission number to select students that are on the waitlist, for a particular course
//When a student a selected for permission number, we enroll them in the course. No extra functionality specified in the problem statement.
router.post("/", function(req, res) {
  console.log("Post permission number data!");
  // ANCHOR
  let waitlistData = req.body.data;
  // let title = waitlistData.title;
  // console.log("Title: ", title);

  db.query(`INSERT INTO courseEnrolments (Email, CourseId) VALUES ('${waitlistData.email}','${waitlistData.courseId}')`, err => {
    if (err) throw err;
    console.log("New details added to enrolled table");
    res.send("Addition Successful!");
  });
});

module.exports = router;
