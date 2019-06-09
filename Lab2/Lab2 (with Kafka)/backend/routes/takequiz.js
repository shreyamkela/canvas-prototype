//Route to handle Get Request Call to show questions and options to a student for a particular quiz.
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Take a Quiz get data called!");

  // ANCHOR
  let quizData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  kafka.make_request("takequiz", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch course", err);
    } else {
      if (result) {
        console.log("Quiz details: ", result.quizzes[quizData.name]);
        res.status(200).send(result.quizzes[quizData.name]);
      } else {
        res.status(400).send();
      }
    }
  });
});

module.exports = router;
