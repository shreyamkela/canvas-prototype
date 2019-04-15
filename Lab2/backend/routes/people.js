//Route to handle Get Request Call to show all people registered for a particular course. Personas can also be save in people table and therefore, we can send faculty name as a seperate key in the json response so that it can be shown on the frontend with a faculty tag.
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get all people data called!");

  // ANCHOR
  kafka.make_request("people", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch course", err);
    } else {
      if (result) {
        console.log("People detail: ", result);
        res.status(200).send(result.people);
      } else {
        res.status(400).send();
      }
    }
  });
});

//Route to handle Post Request Call to remove a student from a course, by a faculty
router.post("/", function(req, res) {
  console.log("Remove a student from people data posted!");
  // ANCHOR
  kafka.make_request("people", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user", err);
    } else {
      if (result) {
        res.send("Removal Successful!");
      } else {
        res.status(400).send();
      }
    }
  });
});

module.exports = router;
