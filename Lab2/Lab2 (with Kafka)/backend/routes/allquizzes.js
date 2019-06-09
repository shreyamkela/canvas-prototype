//Route to handle Get Request Call to show quizzes created in a particular course. If persona is student, show whether an quiz is submitted or not. If the persona is faculty, show all the quizzes created.
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get All Quizzes Data Called!");
  // ANCHOR

  kafka.make_request("allquizzes", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch all quiz details", err);
    } else {
      if (result) {
        console.log("All quiz details for this courseId: ", result);
        res.status(200).send(result.quizzes);
      } else {
        res.status(400).send();
      }
    }
  });
});

module.exports = router;
