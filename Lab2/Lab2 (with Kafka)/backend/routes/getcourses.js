//Route to handle Get Request Call to get all courses for faculty/student depending upon the persona
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  if (req.query.persona === "1") {
    // Persona is of faculty
    console.log("Get Courses data for faculty...", req.query);

    kafka.make_request("getcourses", req, function(err, result) {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (result) {
          console.log("Courses detail: ", result);
          res.status(200).send(result.createdCourses);
        } else {
          console.log("No courses available.");
          res.send("noCourses");
        }
      }
    });
  } else if (req.query.persona === "2") {
    console.log("Get Courses data for student...", req.query);
    kafka.make_request("getcourses", req, function(err, result) {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (result) {
          console.log("Courses detail: ", result);
          res.status(200).send(result.enrolledCourses);
        } else {
          console.log("No courses available.");
          res.send("noCourses");
        }
      }
    });
  }
});

module.exports = router;
