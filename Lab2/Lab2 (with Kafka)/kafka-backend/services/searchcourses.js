const Model = require("../database/connection");

function handle_request(message, callback) {
  console.log("Search Courses data for the query...", req.query);
  let searchValue = message.searchValue.toLowerCase(); // Selecting only those courses to send to frontend, that have been created by the logged in faculty. We make the search query lowercase and will compare with items that will also be made lowercase
  const filterBy = message.filterRadioValue;
  const searchBy = message.searchByRadioValue;
  let searchedCourses = [];
  let searchByQuery = null;

  Model.courseDetails.findOne(
    {
      courseId: announcementData.courseId
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch announcements", err);
      } else {
        if (result) {
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
            for (var key in result) {
              let currentId = result[key].Id.toLowerCase();
              switch (filterBy) {
                case "1":
                  if (currentId === searchValue) {
                    searchedCourses.push(result[key]);
                    console.log("searchedCourses", searchedCourses);
                  }
                  break;
                case "2":
                  if (currentId > searchValue) {
                    searchedCourses.push(result[key]);
                    console.log("searchedCourses", searchedCourses);
                  }
                  break;
                case "3":
                  if (currentId < searchValue) {
                    searchedCourses.push(result[key]);
                    console.log("searchedCourses", searchedCourses);
                  }
                  break;
              }
            }
            if (searchedCourses == []) {
              console.log("No courses available.");
              callback("noCourses", null);
            } else {
              callback(null, searchedCourses);
            }
          } else if (searchByQuery === "Term" || searchByQuery === "Name") {
            for (var key in result) {
              if (searchByQuery === "Term") {
                let currentTerm = result[key].Term.toLowerCase();
                if (currentTerm.includes(searchValue)) {
                  searchedCourses.push(result[key]);
                }
              } else {
                let currentTerm = result[key].Name.toLowerCase();
                if (currentTerm.includes(searchValue)) {
                  searchedCourses.push(result[key]);
                }
              }
            }
            if (searchedCourses === []) {
              console.log("No courses available.");
              callback("noCourses", null);
            } else {
              console.log("searchedCourses", searchedCourses);
              callback(null, searchedCourses);
            }
          } else {
            console.log("No courses available.");
            callback("noCourses", null);
          }
        }
      }
    }
  );
}

exports.handle_request = handle_request;
