//Route to handle Get Request Call to get all grades for a particular course, for a student
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get all grades for this course called!");

  // ANCHOR
  let gradeData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  Model.userDetails.findOne(
    {
      email: gradeData.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch grades", err);
      } else {
        if (user) {
          console.log("Grades detail: ", user);
          callback(null, user);
        } else {
          callback(err, null);
        }
      }
    }
  );
});

module.exports = router;
