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
          console.log("Grades detail: ", result);
          callback(null, result);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

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
          user.grades.push(gradeData.grade);
          user.save().then(
            doc => {
              console.log("New details added to this user grade", doc);
              callback(null, result);
            },
            err => {
              console.log("Unable to save grade details.", err);
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
