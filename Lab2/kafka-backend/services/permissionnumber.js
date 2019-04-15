const Model = require("../database/connection");

function handle_request(message, callback) {
  console.log("Get waitlist/permission number data!");
  // ANCHOR
  let waitlistData = message; // In GET request, req.query is used to access the data sent from frontend in params
  Model.courseDetails.findOne(
    {
      courseId: waitlistData.courseId
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch course", err);
        callback(err, null);
      } else {
        if (result) {
          console.log("Waitlist detail: ", result);
          callback(null, result);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

function handle_request(message, callback) {
  console.log("Post permission number data!");
  // ANCHOR
  let waitlistData = message.data;
  // let title = waitlistData.title;
  // console.log("Title: ", title);

  Model.courseDetails.findOne(
    {
      courseId: waitlistData.courseId
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch course", err);
        callback(err, null);
      } else {
        if (result) {
          result.waitlistedStudents.push(waitlistData.permissionnumber);
          result.save().then(
            doc => {
              console.log("New details added to this course waitlist", doc);
              callback("Addition Successful!", result);
            },
            err => {
              console.log("Unable to save waitlist details.", err);
              callback("Unable to save waitlist details", null);
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
