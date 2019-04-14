//Route to handle Get Request Call to get all courses for faculty/student depending upon the persona
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  if (req.query.persona === "1") {
    // Persona is of faculty
    console.log("Get Courses data for faculty...", req.query);
    const email = req.query.email; // Selecting only those courses to send to frontend, that have been created by the logged in faculty

    Model.userDetails.findOne(
      {
        email: req.query.email
      },
      (err, user) => {
        if (err) {
          console.log("Unable to fetch user", err);
        } else {
          if (user) {
            console.log("Courses detail: ", user);
            res.status(200).send(user.createdCourses);
          } else {
            console.log("No courses available.");
            res.send("noCourses");
          }
        }
      }
    );
  } else if (req.query.persona === "2") {
    console.log("Get Courses data for student...", req.query);
    const email = req.query.email; // Selecting only those courses to send to frontend, that have been created by the logged in faculty
    Model.userDetails.findOne(
      {
        email: req.query.email
      },
      (err, user) => {
        if (err) {
          console.log("Unable to fetch user", err);
        } else {
          if (user) {
            console.log("Courses detail: ", user);
            res.status(200).send(user.enrolledCourses);
          } else {
            console.log("No courses available.");
            res.send("noCourses");
          }
        }
      }
    );
  }
});

module.exports = router;
