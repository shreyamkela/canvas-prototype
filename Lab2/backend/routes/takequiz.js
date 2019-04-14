//Route to handle Get Request Call to show questions and options to a student for a particular quiz.
const express = require("express");
const router = express.Router();
const db = require("../database/mongoose");

router.get("/", function(req, res) {
  console.log("Take a Quiz get data called!");

  // ANCHOR
  let quizData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM quiz WHERE Name = '${quizData.name}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Quiz data for this quiz name:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

module.exports = router;
