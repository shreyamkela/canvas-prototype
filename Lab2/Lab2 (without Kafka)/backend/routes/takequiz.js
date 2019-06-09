//Route to handle Get Request Call to show questions and options to a student for a particular quiz.
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Take a Quiz get data called!");

  // ANCHOR
  let quizData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  Model.courseDetails.findOne(
    {
      courseId: quizData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch course", err);
      } else {
        if (user) {
          console.log("Quiz details: ", user.quizzes[quizData.name]);
          res.status(200).send(user.quizzes[quizData.name]);
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

module.exports = router;
