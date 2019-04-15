const Model = require("../database/connection");

function handle_request(message, callback) {
  Model.userDetails.findOne(
    {
      email: message.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch grades", err);
        callback(err, null);
      } else {
        if (user) {
          console.log("Grades detail: ", user);
          callback(null, user);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

exports.handle_request = handle_request;
