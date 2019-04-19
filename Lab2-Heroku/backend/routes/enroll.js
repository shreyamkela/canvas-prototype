//Route to handle Post Request Call to enroll into a course and increment the capacity used
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.post("/", function(req, res) {
  console.log("Enrolling into a course!");
  let enrollData = req.body.data;
  console.log("Enroll data: ", enrollData);

  if (enrollData.courseId != undefined) {
    // First we check if enrollData.courseId is undefined
    // Then we check whether this course is already enrolled
    // Then we check whether this course is already waitlisted
    // Then we insert

    Model.userDetails.findOne(
      {
        email: enrollData.email
      },
      (err, user) => {
        if (err) {
          console.log("Unable to fetch user", err);
          res.status(400).end("Unable to enroll course. Please try again."); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
        } else {
          if (user) {
            if (user.enrolledCourses.includes(enrollData.courseId)) {
              // Checking if the course is already enrolled
              console.log("Course already enrolled for this email!");
              res.status(400).end("Course already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
            } else if (user.waitlistedCourses.includes(enrollData.courseId)) {
              // Checking if the course is already waitlisted
              console.log("Course already waitlisted for this email!");
              res.status(400).end("Course already waitlisted!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
            } else {
              user.enrolledCourses.push(enrollData.courseId);
              user.save().then(
                doc => {
                  console.log("New details added to this user details", doc);
                  Model.courseDetails.findOne(
                    {
                      courseId: enrollData.courseId
                    },
                    (err, results) => {
                      if (err) {
                        console.log("Unable to fetch course", err);
                        res.status(400).end("Unable to enroll course. Please try again."); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
                      } else {
                        if (results) {
                          results.enrolledStudents.push(enrollData.email);
                          results.capacityUsed++;
                          results.save().then(
                            doc_1 => {
                              console.log("New details added to this course details", doc_1);
                            },
                            err => {
                              console.log("Unable to enroll student in course. Please try again.", err);
                              res.status(400).send("Unable to enroll course. Please try again.");
                            }
                          );
                          res.send("Course enrolled!");
                        } else {
                          console.log("Unable to fetch course", err);
                          res.status(400).end("Unable to enroll course. Please try again."); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
                        }
                      }
                    }
                  );
                },
                err => {
                  console.log("Unable to enroll course. Please try again.", err);
                  res.status(400).send("Unable to enroll course. Please try again.");
                }
              );
            }
          } else {
            res.status(400).end("Unable to enroll course. Please try again."); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
          }
        }
      }
    );
  }
});

module.exports = router;
