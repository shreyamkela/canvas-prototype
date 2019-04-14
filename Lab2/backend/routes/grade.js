//Route to handle Get Request Call to show grade for an assignment or a quiz of a student, for a particular course
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get an assignment/quiz grade data called!");

  // ANCHOR
  let gradeData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  Model.userDetails.findOne(
    {
      email: gradeData.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          console.log("Grades detail: ", user);
          res.status(200).send(user.grades);
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

//Route to handle Post Request Call to grade an assignment or a quiz or a particular student, by a faculty
router.post("/", function(req, res) {
  console.log("Grade an assignment/quiz data posted!");
  // ANCHOR
  let gradeData = req.body.data;

  // gradeData.type defines whether the submission is an assignment or a quiz

  Model.userDetails.findOne(
    {
      email: gradeData.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          user.grades.push(gradeData.grade);
          user.save().then(
            doc => {
              console.log("New details added to this user grade", doc);
              res.send("Addition Successful!");
            },
            err => {
              console.log("Unable to save grade details.", err);
              res.status(400).send();
            }
          );
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

module.exports = router;
