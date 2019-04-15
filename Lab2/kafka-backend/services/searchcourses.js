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

  Model.courseDetails.findOne(
    {
      courseId: announcementData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch announcements", err);
      } else {
        if (user) {
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

          if (searchByQuery === "Id") {
            for (var key in user) {
              let currentId = user[key].Id.toLowerCase();
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
                let currentTerm = user[key].Term.toLowerCase();
                if (currentTerm.includes(searchValue)) {
                  searchedCourses.push(user[key]);
                }
              } else {
                let currentTerm = user[key].Name.toLowerCase();
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
        }
      }
    }
  );
});

module.exports = router;
