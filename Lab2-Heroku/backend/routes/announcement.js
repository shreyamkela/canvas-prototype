//Route to handle Get Request Call to load all announcements for the faculty email and courseId
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get Announcement Data Called! Announcement Data:", req.query);
  let announcementData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  Model.courseDetails.findOne(
    {
      courseId: announcementData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch announcements", err);
      } else {
        if (user) {
          console.log("Announcements detail: ", user);
          res.status(200).send(user.announcements);
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

//Route to handle Post Request Call to create a new announcement
router.post("/", function(req, res) {
  console.log("Create Announcement Data Posted!");
  let announcementData = req.body.data;

  Model.courseDetails.findOne(
    {
      courseId: announcementData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch course", err);
      } else {
        if (user) {
          user.announcements.push(announcementData);
          user.save().then(
            doc => {
              console.log("New details added to this course announcements", doc);
              res.send("Creation Successful!");
            },
            err => {
              console.log("Unable to save announcement details.", err);
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
