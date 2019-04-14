//Route to handle Get Request Call to show quizzes created in a particular course. If persona is student, show whether an quiz is submitted or not. If the persona is faculty, show all the quizzes created.
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get All Quizzes Data Called!");
  // ANCHOR
  let quizData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  Model.courseDetails.findOne(
    {
      courseId: quizData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch all quiz details", err);
      } else {
        if (user) {
          console.log("All quiz details for this courseId: ", user);
          res.status(200).send(user.quizzes);
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

module.exports = router;
