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
          callback(null, result);
        }
      }
    }
  );
}

exports.handle_request = handle_request;
