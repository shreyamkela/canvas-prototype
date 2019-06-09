const Model = require("../database/connection");

function handle_request(message, callback) {
  Model.courseDetails.findOne(
    {
      courseId: message.courseId
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch courses", err);
        callback(err, null);
      } else {
        if (result) {
          console.log("Course id already present!"); //FIXME Make page stay on frontend if course id already present
          callback("Course id already present!", null);
        } else {
          callback(null, result);
        }
      }
    }
  );
}

exports.handle_request = handle_request;
