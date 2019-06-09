const Model = require("../database/connection");

function handle_request(message, callback) {
  Model.courseDetails.findOne(
    {
      courseId: message.courseId
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch announcements", err);
        callback(err, null);
      } else {
        if (result) {
          console.log("Announcements detail: ", result);
          user.announcements.push(result);
          user.save().then(
            doc => {
              console.log("New details added to this course announcements", doc);
              callback("Creation Successful!", result);
            },
            err => {
              console.log("Unable to save announcement details.", err);
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

function handle_request(message, callback) {
  Model.courseDetails.findOne(
    {
      courseId: message.courseId
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch course", err);
        callback(err, null);
      } else {
        if (result) {
          callback(null, result);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

exports.handle_request = handle_request;
