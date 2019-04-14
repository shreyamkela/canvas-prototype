//Route to handle Get Request Call to show all people registered for a particular course. Personas can also be save in people table and therefore, we can send faculty name as a seperate key in the json response so that it can be shown on the frontend with a faculty tag.
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get all people data called!");

  // ANCHOR
  let peopleData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  Model.courseDetails.findOne(
    {
      courseId: peopleData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch course", err);
      } else {
        if (user) {
          console.log("People detail: ", user);
          res.status(200).send(user.people);
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

//Route to handle Post Request Call to remove a student from a course, by a faculty
router.post("/", function(req, res) {
  console.log("Remove a student from people data posted!");
  // ANCHOR
  let peopleData = req.body.data;
  // let title = peopleData.title;
  // console.log("Title: ", title);

  Model.userDetails.findOne(
    {
      email: peopleData.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          user.enrolledcourses.remove(peopleData.courseId);
          user.save().then(
            doc => {
              console.log("Course removed from this user", doc);
              res.send("Removal Successful!");
            },
            err => {
              console.log("Unable to save remove course.", err);
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
