const Model = require("../database/connection");

function handle_request(message, callback) {
  Model.courseDetails.findOne(
    {
      courseId: message.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch all quiz details", err);
        callback(err, null);
      } else {
        if (user) {
          console.log("All quiz details for this courseId: ", user);
          callback(null, user);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

exports.handle_request = handle_request;
