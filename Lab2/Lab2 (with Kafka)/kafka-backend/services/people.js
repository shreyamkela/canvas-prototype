const Model = require("../database/connection");

function handle_request(message, callback) {
  console.log("Get all people data called!");

  // ANCHOR
  let peopleData = message; // In GET request, req.query is used to access the data sent from frontend in params

  Model.courseDetails.findOne(
    {
      courseId: peopleData.courseId
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch course", err);
        callback(err, null);
      } else {
        if (result) {
          console.log("People detail: ", result);
          callback(null, result);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

//Route to handle Post Request Call to remove a student from a course, by a faculty
function handle_request(message, callback) {
  console.log("Remove a student from people data posted!");
  // ANCHOR
  let peopleData = message.data;
  // let title = peopleData.title;
  // console.log("Title: ", title);

  Model.userDetails.findOne(
    {
      email: peopleData.email
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch user", err);
        callback(err, null);
      } else {
        if (result) {
          result.enrolledcourses.remove(peopleData.courseId);
          result.save().then(
            doc => {
              console.log("Course removed from this user", doc);
              callback("Removal Successful!", result);
            },
            err => {
              console.log("Unable to save remove course.", err);
              callback(err, null);
            }
          );
        } else {
          callback(err, null);
        }
      }
    }
  );
}

exports.handle_request = handle_request;
