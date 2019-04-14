//Route to handle Post Request Call to waitlist a course, increment the waitlist used, and FIXME send a notification to faculty that waitlists exist
const express = require("express");
const router = express.Router();
const db = require("../database/mongoose");

router.post("/", function(req, res) {
  console.log("Waitlisting into a course!");
  let waitlistData = req.body.data;
  console.log("Waitlist data: ", waitlistData);

  let alreadyEnrolled = false;

  let alreadyWaitlisted = false;
  if (waitlistData.courseId != undefined) {
    // First we check if waitlistData.courseId is undefined
    // Then we check whether this course is already waitlisted
    // Then we check whether this course is already enrolled
    // Then we insert
    db.query(`SELECT * FROM coursewaitlists WHERE CourseId = '${waitlistData.courseId}'`, (err, results) => {
      if (err) throw err;
      console.log(results);
      for (var key in results) {
        if (results[key].StudentEmail == waitlistData.email) {
          console.log("Course already waitlisted for this email!");
          alreadyWaitlisted = true;
          res.status(400).end("Course already waitlisted!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
          break;
        }
      }
      if (alreadyWaitlisted !== true) {
        db.query(`SELECT * FROM courseenrolments WHERE CourseId = '${waitlistData.courseId}'`, (err, results_enrolled) => {
          if (err) throw err;
          for (var key in results_enrolled) {
            if (results_enrolled[key].StudentEmail == waitlistData.email) {
              // If already enrolled then throw error
              console.log("Cannot waitlist as course is already enrolled for this email!");
              alreadyEnrolled = true;
              res.status(400).end("Cannot waitlist as course is already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
              break;
            }
          }
          if (alreadyEnrolled !== true) {
            db.query(`INSERT INTO coursewaitlists (CourseId, StudentEmail) VALUES ('${waitlistData.courseId}','${waitlistData.email}')`, err => {
              if (err) throw err;
              console.log("New details added to coursewaitlists table");
            });
            db.query(`SELECT WaitlistUsed FROM courses WHERE Id= '${waitlistData.courseId}'`, (err, results_courses) => {
              if (err) throw err;
              // Increment the WaitlistUsed
              let waitlistUsed = results_courses[0].WaitlistUsed + 1;
              db.query(`UPDATE courses SET WaitlistUsed = '${waitlistUsed}' WHERE Id = '${waitlistData.courseId}'`, err => {
                if (err) throw err;
                console.log("WaitlistUsed updated in the courses table");
                res.status(200).end("Course waitlisted!");
              });
            });
          }
        });
      }
    });
  }
});

module.exports = router;
