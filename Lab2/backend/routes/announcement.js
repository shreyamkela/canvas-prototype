//Route to handle Get Request Call to load all announcements for the faculty email and courseId
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get Announcement Data Called! Announcement Data:", req.query);
  let announcementData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  kafka.make_request("announcement", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch announcements", err);
    } else {
      if (result) {
        console.log("Announcements detail: ", result);
        res.status(200).send(result.announcements);
      } else {
        res.status(400).send();
      }
    }
  });
});

//Route to handle Post Request Call to create a new announcement
router.post("/", function(req, res) {
  console.log("Create Announcement Data Posted!");
  let announcementData = req.body.data;

  kafka.make_request("announcement", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch announcements", err);
    } else {
      if (result) {
        console.log("Announcements detail: ", result);
        res.status(200).send(result.announcements);
      } else {
        res.status(400).send();
      }
    }
  });

  Model.courseDetails.findOne(
    {
      courseId: announcementData.courseId
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch course", err);
        res.status(400).send();
      } else {
        if (result) {
          res.status(200).sendFile(__dirname + `${result[key].Path}`);
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

module.exports = router;
