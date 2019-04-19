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

    Model.userDetails.findOne(
      {
        email: enrollData.email
      },
      (err, user) => {
        if (err) {
          console.log("Unable to fetch user", err);
        } else {
          if (user) {
            console.log("Course already enrolled for this email!");
            alreadyEnrolled = true;
            res.status(400).end("Course already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
          } else {
            user.enrolledCourses.push(enrollData.course);
            user.save().then(
              doc => {
                console.log("New details added to this user details", doc);
                res.send("Addition Successful!");
              },
              err => {
                console.log("Unable to save course details.", err);
                res.status(400).send();
              }
            );
          }
        }
      }
    );
  }
});

module.exports = router;
