//Route to handle Get Request Call to search all courses for a student based on their query
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Search Courses data for the query...", req.query);
  kafka.make_request("searchcourses", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch announcements", err);
    } else {
      if (result) {
        res.send(result);
      } else {
        console.log("No courses available.");
        res.send("noCourses");
      }
    }
  });
});

module.exports = router;
