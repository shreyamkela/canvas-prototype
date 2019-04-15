const Model = require("../database/connection");

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
          console.log("Announcements detail: ", user);
          callback(null, result);
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
        if (user) {
          callback(null, result);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

exports.handle_request = handle_request;
