//Route to handle Get Request Call to get all grades for a particular course, for a student
const express = require("express");
const router = express.Router();
const db = require("../database/mongoose");

router.get("/", function(req, res) {
  console.log("Get all grades for this course called!");

  // ANCHOR
  let gradeData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM grade WHERE Email = '${gradeData.email}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Grade data for this Email:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

module.exports = router;
