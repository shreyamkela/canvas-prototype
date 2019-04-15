const Model = require("../database/connection");

function handle_request(message, callback) {
  Model.userDetails.findOne(
    {
      email: message.email
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch user", err);
        callback(err, null);
      } else {
        if (result) {
          callback("Course already enrolled!", null);
        } else {
          result.enrolledCourses.push(enrollData.course);
          result.save().then(
            doc => {
              console.log("New details added to this user details", doc);
              callback(null, result);
            },
            err => {
              console.log("Unable to save course details.", err);
              callback(err, null);
            }
          );
        }
      }
    }
  );
}

exports.handle_request = handle_request;
