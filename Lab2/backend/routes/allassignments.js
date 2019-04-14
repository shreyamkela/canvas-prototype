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
      } else {
        if (user) {
          console.log("Assignments detail: ", user);
          for (key in user) {
            res.status(200).sendFile(__dirname + `${results[key].Path}`);
          }
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

module.exports = router;
