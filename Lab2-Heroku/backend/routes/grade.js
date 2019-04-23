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
  console.log("Grade an assignment/quiz data posted!", req.body.data);
  // ANCHOR
  let gradeData = req.body.data;

  // gradeData.type defines whether the submission is an assignment or a quiz
  if (gradeData.type === 1) {
    // Assignment
    Model.userDetails.findOne(
      {
        email: gradeData.studentEmail
      },
      (err, user) => {
        if (err) {
          console.log("Unable to fetch user", err);
          res.status(400).send();
        } else {
          console.log(user);
          // Use if else to check whether this field already exists or not
          if (user["grades"] == undefined) {
            user["grades"] = {};
          }
          if (user["grades"][gradeData.courseId] == undefined) {
            user["grades"][gradeData.courseId] = {};
          }
          // this way we add object inside an object inside an object, for faster look ups - We dont use an array
          user["grades"][gradeData.courseId][gradeData.assignmentId] = gradeData.grade;
          user.markModified("grades"); // NOTE Sometimes the mongo db does not get updated even on using user.save(). Mongo is not able to detect changes and thus doesnt save. Therefore we hard modify the db with markModified so that it will be saved
          user.save().then(
            doc => {
              console.log("New grade details added to this user");
              res.send("Addition Successful!");
            },
            err => {
              console.log("Unable to save grade details.", err);
              res.status(400).send();
            }
          );
        }
        // if (user) {
        //   for (var i = 0; i < user.assignments.length; i++) {
        //     if (user.assignments[i].assignmentId == gradeData.assignmentId) {
        //       let temp = user.assignments[i].submissions[gradeData.studentEmail];
        //       temp.grade = [];
        //       temp.grade.push(gradeData.grade);
        //       user.assignments[i].submissions[gradeData.studentEmail] = temp;
        //       //user.assignments[i].submissions[gradeData.studentEmail].push({ grade: gradeData.grade });
        //       console.log("FFFFFFFFFFFFFFF", user.assignments[i].submissions[gradeData.studentEmail]);
        //     }
        //   }
        //   user.markModified("assignments"); // NOTE Sometimes the mongo db does not get updated even on using user.save(). Mongo is not able to detect changes and thus doesnt save. Therefore we hard modify the db with markModified so that it will be saved
        //   user.save().then(
        //     doc => {
        //       console.log("New grade details added to this assignment");
        //       res.send("Addition Successful!");
        //     },
        //     err => {
        //       console.log("Unable to save grade details.", err);
        //       res.status(400).send();
        //     }
        //   );
        // } else {
        //   console.log("Unable to fetch user", err);
        //   res.status(400).send();
        // }
      }
    );
  }
});

module.exports = router;
