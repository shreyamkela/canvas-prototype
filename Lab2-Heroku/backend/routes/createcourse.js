//Route to handle Post Request Call to create a new course
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");
const mongoose = require("mongoose");

router.post("/", function(req, res) {
  console.log("Create Course Data Posted!");
  let courseData = req.body.data;
  let id = courseData.courseId;
  console.log("Id: ", id);

  Model.courseDetails.findOne(
    {
      courseId: courseData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch courses", err);
      } else {
        if (user) {
          console.log("Course id already present!"); //FIXME Make page stay on frontend if course id already present
          res.send("Course id already present!");
        } else {
          // if not present
          var id = mongoose.Types.ObjectId();
          var user = new Model.courseDetails({
            id: id,
            courseId: courseData.courseId,
            courseName: courseData.name,
            facultyEmail: courseData.email,
            department: courseData.department,
            description: courseData.desc,
            room: courseData.room,
            capacity: courseData.capacity,
            waitlist: courseData.waitlist,
            term: courseData.term,
            capacityUsed: 0,
            waitlistUsed: 0,
            announcements: {},
            files: {},
            assignments: {},
            quizzes: {},
            enrolledStudents: [],
            waitlistedStudents: []
          });

          user.save().then(
            doc => {
              console.log("Course saved successfully.", doc);

              Model.userDetails.updateOne(
                {
                  email: courseData.email
                },
                { $push: { createdCourses: courseData.courseId } },
                (err, result) => {
                  if (err) {
                    console.log("Unable to fetch faculty.", err);
                    res.status(400).send("Unable to save course details."); // status should come before send
                  } else {
                    if (result) {
                      res.status(200).send("Creation Successful!"); // status should come before send
                    } else {
                      console.log("Faculty not found!", err);
                      res.status(400).send("Unable to save course details."); // status should come before send
                    }
                  }
                }
              );
            },
            err => {
              console.log("Unable to save course details.", err);
              res.status(400).send("Unable to save course details."); // status should come before send
            }
          );
        }
      }
    }
  );
});

module.exports = router;
