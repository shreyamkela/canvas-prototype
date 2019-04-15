//Route to handle Get Request Call to show assignments created in a particular course. If persona is student, show whether an assignment is submitted or not. If the persona is faculty, show all the assignments created.
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get All Assignments Data Called!");
  // ANCHOR
  kafka.make_request("allassignments", req, function(err, result) {
    if (err) {
      console.log("Error in fetching all assignments.", err);
      res.status(400).send();
    } else {
      console.log("Assignments detail: ", result);
      for (key in result) {
        res.status(200).sendFile(__dirname + `${result[key].Path}`);
      }
    }
  });
});

module.exports = router;
