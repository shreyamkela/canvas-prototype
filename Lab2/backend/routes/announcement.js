//Route to handle Get Request Call to load all announcements for the faculty email and courseId
const express = require("express");
const router = express.Router();
const db = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get Announcement Data Called! Announcement Data:", req.query);
  let announcementData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  db.query(`SELECT Title, Description FROM Announcements WHERE CourseId = '${announcementData.courseId}'`, (err, results) => {
    if (err) throw err;
    console.log("Announcements for this CourseId:", results);
    res.send(results);
  });
});

//Route to handle Post Request Call to create a new announcement
router.post("/", function(req, res) {
  console.log("Create Announcement Data Posted!");
  let announcementData = req.body.data;
  // let title = announcementData.title;
  // console.log("Title: ", title);

  db.query(
    `INSERT INTO Announcements (Title, Description, Email, CourseId) VALUES ('${announcementData.title}','${announcementData.desc}','${
      announcementData.email
    }','${announcementData.courseId}')`,
    err => {
      if (err) throw err;
      console.log("New details added to Announcement table");
      res.send("Creation Successful!");
    }
  );
});

module.exports = router;
