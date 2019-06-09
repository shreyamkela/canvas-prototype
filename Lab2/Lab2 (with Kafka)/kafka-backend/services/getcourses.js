const Model = require("../database/connection");

function handle_request(message, callback) {
  if (message.persona === "1") {
    // Persona is of faculty

    Model.userDetails.findOne(
      {
        email: message.email
      },
      (err, result) => {
        if (err) {
          console.log("Unable to fetch user", err);
        } else {
          if (result) {
            console.log("Courses detail: ", user);
            callback(null, result);
          } else {
            console.log("No courses available.");
            callback("noCourses", null);
          }
        }
      }
    );
  } else if (message.persona === "2") {
    Model.userDetails.findOne(
      {
        email: message.email
      },
      (err, result) => {
        if (err) {
          console.log("Unable to fetch user", err);
        } else {
          if (result) {
            console.log("Courses detail: ", result);
            callback(null, result);
          } else {
            console.log("No courses available.");
            callback("noCourses", null);
          }
        }
      }
    );
  }
}

exports.handle_request = handle_request;
