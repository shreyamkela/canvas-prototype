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
        if (result) {
          result.assignments.push(assignmentData);
          result.save().then(doc => {
            console.log("New details added to this course assignments", doc);
            let file = {
              folder: assignmentData.folder,
              filePath: assignmentData.filename,
              document: assignmentData.document
            };
            // FIXME Store assignment links in a table
            // Insert document using multer
            insertDocuments(Model, file, assignmentData.courseId, assignmentData.email, () => {
              callback(null, result);
            });
          });
        } else {
          callback(err, null);
          //
        }
      }
    }
  );
}

exports.handle_request = handle_request;
