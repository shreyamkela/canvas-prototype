const Model = require("../database/connection");
const insertDocuments = require("../uploads/_helpers/insertDocuments");

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
          user.files.push(filesData);
          user.save().then(
            doc => {
              console.log("New details added to this course files", doc);
              let file = {
                folder: filesData.folder,
                filePath: filesData.filename,
                document: filesData.document
              };
              // FIXME Store assignment links in a table
              // Insert document using multer
              insertDocuments(Model, file, filesData.courseId, filesData.email, () => {
                callback(null, result);
              });
            },
            err => {
              console.log("Unable to save file details.", err);
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
