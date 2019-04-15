const Model = require("../database/connection");

function handle_request(message, callback) {
  Model.courseDetails.findOne(
    {
      courseId: message.courseId
    },
    (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

exports.handle_request = handle_request;
