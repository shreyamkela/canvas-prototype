//Route to handle Post Request Call to drop a course by a student
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.post("/", function(req, res) {
  console.log("Drop a course data posted!");
  // ANCHOR
  let courseData = req.body.data;
  // let title = courseData.title;
  // console.log("Title: ", title);

  Model.userDetails.findOne(
    {
      email: courseData.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          user.enrolledcourses.remove(courseData.courseId);
          user.save().then(
            doc => {
              console.log("Course removed from this user", doc);
              res.send("Removal Successful!");
            },
            err => {
              console.log("Unable to save remove course.", err);
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
