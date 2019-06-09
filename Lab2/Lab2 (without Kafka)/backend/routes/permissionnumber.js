//Route to handle Get Request Call show all students that are on the waitlist and require permission numbers, for a particular course
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get waitlist/permission number data!");
  // ANCHOR
  let waitlistData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  Model.courseDetails.findOne(
    {
      courseId: waitlistData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch course", err);
      } else {
        if (user) {
          console.log("Waitlist detail: ", user);
          res.status(200).send(user.waitlistedStudents);
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

//Route to handle Post Request Call to provide permission number to select students that are on the waitlist, for a particular course
//When a student a selected for permission number, we enroll them in the course. No extra functionality specified in the problem statement.
router.post("/", function(req, res) {
  console.log("Post permission number data!");
  // ANCHOR
  let waitlistData = req.body.data;
  // let title = waitlistData.title;
  // console.log("Title: ", title);

  Model.courseDetails.findOne(
    {
      courseId: waitlistData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch course", err);
      } else {
        if (user) {
          user.waitlistedStudents.push(waitlistData.permissionnumber);
          user.save().then(
            doc => {
              console.log("New details added to this course waitlist", doc);
              res.send("Addition Successful!");
            },
            err => {
              console.log("Unable to save waitlist details.", err);
              res.status(400).send();
            }
          );
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

module.exports = router;
