//Route to handle Post Request Call to create a new course
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.post("/", function(req, res) {
  console.log("Create Course Data Posted!");
  let courseData = req.body.data;
  let id = courseData.courseId;
  console.log("Id: ", id);

  kafka.make_request("createcourse", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch courses", err);
    } else {
      if (result) {
        console.log("Course id already present!"); //FIXME Make page stay on frontend if course id already present
        res.send("Course id already present!");
      } else {
        res.status(200).send("Creation Successful!"); // status should come before send
      }
    }
  });
});

module.exports = router;
