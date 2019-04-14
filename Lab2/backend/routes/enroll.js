//Route to handle Post Request Call to enroll into a course and increment the capacity used
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.post("/", function(req, res) {
  console.log("Enrolling into a course!");
  let enrollData = req.body.data;
  console.log("Enroll data: ", enrollData);

  let alreadyEnrolled = false;
  let alreadyWaitlisted = false;
  if (enrollData.courseId != undefined) {
    // First we check if enrollData.courseId is undefined
    // Then we check whether this course is already enrolled
    // Then we check whether this course is already waitlisted
    // Then we insert
    db.query(`SELECT * FROM courseenrolments WHERE CourseId = '${enrollData.courseId}'`, (err, results) => {
      if (err) throw err;
      console.log(results);
      for (var key in results) {
        if (results[key].StudentEmail == enrollData.email) {
          // If already enrolled then throw error
          console.log("Course already enrolled for this email!");
          alreadyEnrolled = true;
          res.status(400).end("Course already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
          break;
        }
      }
      if (alreadyEnrolled !== true) {
        db.query(`SELECT * FROM coursewaitlists WHERE CourseId = '${enrollData.courseId}'`, (err, results_waitlists) => {
          if (err) throw err;
          for (var key in results_waitlists) {
            if (results_waitlists[key].StudentEmail == enrollData.email) {
              // If already waitlisted then throw error
              console.log("Cannot enroll as course is already waitlisted for this email!");
              alreadyWaitlisted = true;
              res.status(400).end("Cannot enroll as course is already waitlisted!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
              break;
            }
          }
          if (alreadyWaitlisted !== true) {
            db.query(`INSERT INTO courseenrolments (CourseId, StudentEmail) VALUES ('${enrollData.courseId}','${enrollData.email}')`, err => {
              if (err) throw err;
              console.log("New details added to courseenrolments table");
            });
            db.query(`SELECT CapacityUsed FROM courses WHERE Id= '${enrollData.courseId}'`, (err, results_courses) => {
              if (err) throw err;
              // Increment the capacityUsed
              let capacityUsed = results_courses[0].CapacityUsed + 1;
              db.query(`UPDATE courses SET CapacityUsed = '${capacityUsed}' WHERE Id = '${enrollData.courseId}'`, err => {
                if (err) throw err;
                console.log("CapacityUsed updated in the courses table");
                res.status(200).end("Course enrolled!");
              });
            });
          }
        });
      }
    });
  }
});

module.exports = router;
