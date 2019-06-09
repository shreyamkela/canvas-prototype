//Route to handle Get Request Call to get all grades for a particular course, for a student
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get all grades for this course called!");

  kafka.make_request("allgrades", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch grades", err);
      res.status(400).send();
    } else {
      console.log("Grades detail: ", result);
      res.status(200).send(result.grades);
    }
  });
});
module.exports = router;
