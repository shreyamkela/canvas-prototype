//Route to handle Post Request Call to waitlist a course, increment the waitlist used, and FIXME send a notification to faculty that waitlists exist
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.post("/", function(req, res) {
  console.log("Waitlisting into a course!");
  let waitlistData = req.body.data;
  console.log("Waitlist data: ", waitlistData);
  let alreadyWaitlisted = false;
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
            console.log("Course already waitlisted for this email!");
            alreadyWaitlisted = true;
            res.status(400).end("Course already waitlisted!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
          } else {
            user.waitlistedCourses.push(waitlistData.course);
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
