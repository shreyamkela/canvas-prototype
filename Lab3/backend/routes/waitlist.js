//Route to handle Post Request Call to waitlist a course, increment the waitlist used, and FIXME send a notification to faculty that waitlists exist
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.post("/", function(req, res) {
  console.log("Waitlisting into a course!");
  let waitlistData = req.body.data;
  console.log("Waitlist data: ", waitlistData);
  if (waitlistData.courseId != undefined) {
    // First we check if waitlistData.courseId is undefined
    // Then we check whether this course is already waitlisted
    // Then we check whether this course is already enrolled
    // Then we insert

    Model.userDetails.findOne(
      {
        email: waitlistData.email
      },
      (err, user) => {
        if (err) {
          console.log("Unable to fetch user", err);
        } else {
          if (user) {
            if (user.enrolledCourses.includes(waitlistData.courseId)) {
              // Checking if the course is already enrolled
              console.log("Course already enrolled for this email!");
              res.status(400).end("Course already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
            } else if (user.waitlistedCourses.includes(waitlistData.courseId)) {
              // Checking if the course is already waitlisted
              console.log("Course already waitlisted for this email!");
              res.status(400).end("Course already waitlisted!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
            } else {
              user.waitlistedCourses.push(waitlistData.courseId);
              user.save().then(
                doc => {
                  console.log("New details added to this user details", doc);
                  Model.courseDetails.findOne(
                    {
                      courseId: waitlistData.courseId
                    },
                    (err, results) => {
                      if (err) {
                        console.log("Unable to fetch course", err);
                        res.status(400).end("Unable to waitlist course. Please try again."); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
                      } else {
                        if (results) {
                          results.waitlistedStudents.push(waitlistData.email);
                          results.waitlistUsed++;
                          results.save().then(
                            doc_1 => {
                              console.log("New details added to this course details", doc_1);
                            },
                            err => {
                              console.log("Unable to waitlist student in course. Please try again.", err);
                              res.status(400).send("Unable to waitlist course. Please try again.");
                            }
                          );
                          res.send("Course waitlisted!");
                        } else {
                          console.log("Unable to fetch course", err);
                          res.status(400).end("Unable to waitlist course. Please try again."); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
                        }
                      }
                    }
                  );
                },
                err => {
                  console.log("Unable to waitlist course. Please try again.", err);
                  res.status(400).send("Unable to waitlist course. Please try again.");
                }
              );
            }
          } else {
            res.status(400).end("Unable to waitlist course. Please try again."); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
          }
        }
      }
    );
  }
});

module.exports = router;
