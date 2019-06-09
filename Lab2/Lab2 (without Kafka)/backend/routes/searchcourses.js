//Route to handle Get Request Call to search all courses for a student based on their query
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Search Courses data for the query...", req.query);
  let searchValue = req.query.searchValue.toLowerCase(); // Selecting only those courses to send to frontend, that have been created by the logged in faculty. We make the search query lowercase and will compare with items that will also be made lowercase
  const filterBy = req.query.filterRadioValue;
  const searchBy = req.query.searchByRadioValue;
  let searchedCourses = [];
  let searchByQuery = null;

  switch (searchBy) {
    case "id":
      searchByQuery = "Id";
      break;
    case "term":
      searchByQuery = "Term";
      break;
    case "name":
      searchByQuery = "Name";
      break;
  }

  Model.courseDetails.find({}, (err, user) => {
    if (err) {
      console.log("Unable to fetch courses", err);
      res.status(400).send("Unable to fetch courses!");
    } else {
      if (user) {
        console.log("XXXXXXXXXXXXXXXXXXXXx", user);
        if (searchByQuery === "Id") {
          for (var key in user) {
            let currentId = user[key].courseId.toLowerCase();
            switch (filterBy) {
              case "1":
                if (currentId === searchValue) {
                  searchedCourses.push(user[key]);
                  console.log("searchedCourses", searchedCourses);
                }
                break;
              case "2":
                if (currentId > searchValue) {
                  searchedCourses.push(user[key]);
                  console.log("searchedCourses", searchedCourses);
                }
                break;
              case "3":
                if (currentId < searchValue) {
                  searchedCourses.push(user[key]);
                  console.log("searchedCourses", searchedCourses);
                }
                break;
            }
          }
          if (searchedCourses == []) {
            console.log("No courses available.");
            res.send("noCourses");
          } else {
            res.send(searchedCourses);
          }
        } else if (searchByQuery === "Term" || searchByQuery === "Name") {
          for (var key in user) {
            if (searchByQuery === "Term") {
              let currentTerm = user[key].term.toLowerCase();
              if (currentTerm.includes(searchValue)) {
                searchedCourses.push(user[key]);
              }
            } else {
              let currentTerm = user[key].courseName.toLowerCase();
              if (currentTerm.includes(searchValue)) {
                searchedCourses.push(user[key]);
              }
            }
          }
          if (searchedCourses === []) {
            console.log("No courses available.");
            res.send("noCourses");
          } else {
            console.log("searchedCourses", searchedCourses);
            res.send(searchedCourses);
          }
        } else {
          console.log("No courses available.");
          res.send("noCourses");
        }
        //res.status(200).end("Course already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
      } else {
        console.log("Unable to fetch courses", err);
        res.status(400).send("No courses found!");
      }
    }
  });
});

module.exports = router;
