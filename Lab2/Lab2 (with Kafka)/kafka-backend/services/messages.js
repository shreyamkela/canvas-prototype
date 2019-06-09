const Model = require("../database/connection");

function handle_request(message, callback) {
  Model.messageDetails.findOne(
    {
      senderId: message.email
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch user", err);
        callback(err, null);
      } else {
        if (result) {
          console.log("Messages detail: ", result);
          callback(null, result);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

function handle_request(message, callback) {
  Model.messageDetails.findOne(
    {
      senderId: message.email
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (result) {
          result.message.push(messageData.message);
          result.save().then(
            doc => {
              console.log("New details added to this user messages", doc);
              callback(null, result);
            },
            err => {
              console.log("Unable to save message details.", err);
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
