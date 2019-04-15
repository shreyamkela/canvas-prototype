//Route to handle Post Request Call to drop a course by a student
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.post("/", function(req, res) {
  console.log("Drop a course data posted!");
  // ANCHOR
  // let title = courseData.title;
  // console.log("Title: ", title);

  kafka.make_request("dropcourse", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user", err);
    } else {
      if (result) {
        res.status(200).send("Removal Successful!");
      } else {
        res.status(400).send();
      }
    }
  });
});

module.exports = router;
