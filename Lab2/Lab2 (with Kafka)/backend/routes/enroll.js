//Route to handle Post Request Call to enroll into a course and increment the capacity used
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.post("/", function(req, res) {
  console.log("Enrolling into a course!");
  let enrollData = req.body.data;
  console.log("Enroll data: ", enrollData);

  let alreadyEnrolled = false;
  if (enrollData.courseId != undefined) {
    // First we check if enrollData.courseId is undefined
    // Then we check whether this course is already enrolled
    // Then we check whether this course is already waitlisted
    // Then we insert
    kafka.make_request("enroll", req, function(err, result) {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (result) {
          console.log("Course already enrolled for this email!");
          alreadyEnrolled = true;
          res.status(400).end("Course already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
        } else {
          res.send("Addition Successful!");
        }
      }
    });
  }
});

module.exports = router;
