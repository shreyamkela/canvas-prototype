//Route to handle Post Request Call to waitlist a course, increment the waitlist used, and FIXME send a notification to faculty that waitlists exist
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.post("/", function(req, res) {
  console.log("Waitlisting into a course!");
  let waitlistData = req.body.data;
  console.log("Waitlist data: ", waitlistData);
  if (waitlistData.courseId != undefined) {
    // First we check if waitlistData.courseId is undefined
    // Then we check whether this course is already waitlisted
    // Then we check whether this course is already enrolled
    // Then we insert

    kafka.make_request("waitlist", req, function(err, result) {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (result) {
          console.log("Course already waitlisted for this email!");
          alreadyWaitlisted = true;
          res.status(400).end("Course already waitlisted!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
        } else {
          res.send("Addition Successful!");
        }
      }
    });
  }
});

module.exports = router;
