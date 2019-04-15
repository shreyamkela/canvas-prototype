//Route to handle Get Request Call to show all uploaded files for a particular course, irrespective of persona
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get all files data called!");

  // ANCHOR
  kafka.make_request("files", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch course", err);
    } else {
      if (result) {
        console.log("Announcements detail: ", result);
        for (key in results) {
          res.status(200).sendFile(__dirname + `${result[key].files.Path}`);
        }
      } else {
        res.status(400).send();
      }
    }
  });
});

//Route to handle Post Request Call to upload a file for a particular course, by a faculty
router.post("/", function(req, res) {
  console.log("Post a file data posted!");

  kafka.make_request("files", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch course", err);
    } else {
      if (result) {
        res.send("Creation Successful!");
      } else {
        res.status(400).send();
      }
    }
  });
});

module.exports = router;
