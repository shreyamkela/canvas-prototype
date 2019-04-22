//Route to handle Get Request Call to show assignments created in a particular course. If persona is student, show whether an assignment is submitted or not. If the persona is faculty, show all the assignments created.
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get All Assignments Data Called!");
  // ANCHOR
  let assignmentData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  Model.courseDetails.findOne(
    {
      courseId: assignmentData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch assignments detail.", err);
        res.status(400).send("Unable to fetch assignments detail.");
      } else {
        if (user) {
          console.log("Assignments detail: ", user);
          res.status(200).send(user.assignments);
        } else {
          console.log("Unable to fetch assignments detail.");
          res.status(400).send("Unable to fetch assignments detail.");
        }
      }
    }
  );
});

module.exports = router;
