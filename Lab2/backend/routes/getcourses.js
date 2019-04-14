//Route to handle Get Request Call to get all courses for faculty/student depending upon the persona
const express = require("express");
const router = express.Router();
const db = require("../database/mongoose");

router.get("/", function(req, res) {
  if (req.query.persona === "1") {
    // Persona is of faculty
    console.log("Get Courses data for faculty...", req.query);
    const email = req.query.email; // Selecting only those courses to send to frontend, that have been created by the logged in faculty
    db.query(`SELECT Id, Name FROM Courses WHERE Email = '${email}'`, (err, results) => {
      if (err) throw err;
      console.log(results);
      if (results[0] !== undefined) {
        res.status(200).send(results);
      } else {
        console.log("No courses available.");
        res.send("noCourses");
      }
    });
  } else if (req.query.persona === "2") {
    console.log("Get Courses data for student...", req.query);
    const email = req.query.email; // Selecting only those courses to send to frontend, that have been created by the logged in faculty
    db.query(`SELECT CourseId FROM courseEnrolments WHERE StudentEmail = '${email}'`, (err, results) => {
      // Fetch all courseIds of enrolled courses
      if (err) throw err;
      console.log("Student is enrolled in the following course ids:", results);
      if (results[0] !== undefined) {
        let allCourses = [];
        let temp = 0;
        for (var key in results) {
          // Fetch the details of all keys, i.e enrolled courses, in a loop and push them into an array. Return the array at the end
          db.query(`SELECT Id, Name FROM Courses WHERE Id = '${results[key].CourseId}'`, (err, results_1) => {
            if (err) throw err;
            allCourses.push(results_1[0]); // results_1 has the data at its 0th index everytime therefore we just push the data into our array and not the index+data
            temp++;
            if (temp === results.length) {
              console.log("Student with this email is enrolled in the following courses:", allCourses);
              res.status(200).send(allCourses); // NOTE - db.query is an async task and will take time. res.status(200).send(allCourses) should happen only on the last iteration of the loop. And in that loop, it should happen after the db.query returns.
              //A code below db.query might run before db.query returns therefore the res.send has to be kept in sunc with db.query therefore we put the res.end inside db.query and put a condition to only res.end if it is the last query
            }
          });
        }
      } else {
        console.log("No courses available.");
        res.end("noCourses");
      }
    });
  }
});

module.exports = router;
