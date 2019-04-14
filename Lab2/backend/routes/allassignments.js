//Route to handle Get Request Call to show assignments created in a particular course. If persona is student, show whether an assignment is submitted or not. If the persona is faculty, show all the assignments created.
const express = require("express");
const router = express.Router();
const db = require("../database/mongoose");

router.get("/", function(req, res) {
  console.log("Get All Assignments Data Called!");
  // ANCHOR
  let assignmentData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM assignments WHERE CourseId = '${assignmentData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      //console.log("assignments data for this course:", results[0]);
      for (key in results) {
        res.status(200).sendFile(__dirname + `${results[key].Path}`);
      }
      // res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

module.exports = router;
