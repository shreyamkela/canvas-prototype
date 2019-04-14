//Route to handle Post Request Call to drop a course by a student
const express = require("express");
const router = express.Router();
const db = require("../database/connection");

router.post("/", function(req, res) {
  console.log("Drop a course data posted!");
  // ANCHOR
  let courseData = req.body.data;
  // let title = courseData.title;
  // console.log("Title: ", title);

  db.query(`DELETE FROM courses WHERE Email = '${courseData.email}'`, err => {
    if (err) throw err;
    res.send("Delete Successful!");
  });
});

module.exports = router;
