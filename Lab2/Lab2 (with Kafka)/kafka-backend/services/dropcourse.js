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
          result.enrolledcourses.remove(courseData.courseId);
          result.save().then(
            doc => {
              console.log("Course removed from this user", doc);
              callback(null, doc);
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
