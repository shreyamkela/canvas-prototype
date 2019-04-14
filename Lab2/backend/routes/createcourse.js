//Route to handle Post Request Call to create a new course
const express = require("express");
const router = express.Router();
const db = require("../database/connection");

router.post("/", function(req, res) {
  console.log("Create Course Data Posted!");
  let courseData = req.body.data;
  let id = courseData.courseId;
  console.log("Id: ", id);

  db.query(`SELECT Name FROM Courses WHERE Id = '${id}'`, (err, results) => {
    if (err) throw err;
    console.log(results);
    console.log(results[0]);
    if (results[0] === undefined) {
      // if not present
      let { courseName, dept, descrip, room, classCap, waitlistCap, term, email } = courseData;
      console.log(id, courseName, dept, descrip, room, classCap, waitlistCap, term, email);
      db.query(
        `INSERT INTO Courses (Id, Name, Department, Description, Room, Capacity, Waitlist, CapacityUsed, WaitlistUsed, Term, Email) VALUES ('${id}','${courseName}','${dept}','${descrip}','${room}','${classCap}','${waitlistCap}', '0', '0', '${term}', '${email}')`,
        err => {
          if (err) throw err;
          console.log("New details added to Courses table");
        }
      );
      res.send("Creation Successful!");
    } else {
      console.log("Course id already present!"); //FIXME Make page stay on frontend if course id already present
      res.send("Course id already present!");
    }
  });
});

module.exports = router;
