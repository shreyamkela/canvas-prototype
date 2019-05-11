//Route to handle Get Request Call to get all courses for faculty/student depending upon the persona
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  // Persona is of faculty
  console.log("Get Courses data for faculty...", req.query);
  const email = req.query.email; // Selecting only those courses to send to frontend, that have been created by the logged in faculty

  Model.userDetails.findOne(
    {
      email: email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          console.log("Courses detail: ", user);

          if (req.query.persona === "1") {
            Model.courseDetails.find({ courseId: { $in: user.createdCourses } }, (err, results) => {
              if (err) {
                console.log("Unable to fetch courses", err);
                res.status(400).send("Unable to fetch courses");
              } else {
                if (results) {
                  console.log("Courses detail: ", results);
                  res.status(200).send(results);
                } else {
                  console.log("Unable to fetch courses");
                  res.status(400).send("Unable to fetch courses");
                }
              }
            });
          } else if (req.query.persona === "2") {
            Model.courseDetails.find({ courseId: { $in: user.enrolledCourses } }, (err, results) => {
              if (err) {
                console.log("Unable to fetch courses", err);
                res.status(400).send("Unable to fetch courses");
              } else {
                if (results) {
                  console.log("Courses detail: ", results);
                  res.status(200).send(results);
                } else {
                  console.log("Unable to fetch courses");
                  res.status(400).send("Unable to fetch courses");
                }
              }
            });
          }
        } else {
          console.log("No courses available.");
          res.send("noCourses");
        }
      }
    }
  );
});

module.exports = router;
