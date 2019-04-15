const Model = require("../database/connection");
const insertDocuments = require("../uploads/_helpers/insertDocuments");

function handle_request(message, callback) {
  console.log("Get profile image!");
  // ANCHOR
  let profileData = message; // In GET request, req.query is used to access the data sent from frontend in params

  Model.userDetails.findOne(
    {
      email: profileData.email
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch user", err);
        callback(err, null);
      } else {
        if (result) {
          callback(null, result);
        } else {
          console.log("Unable to fetch profile image", err);
          callback("Unable to fetch profile image", null);
        }
      }
    }
  );
}

function handle_request(message, callback) {
  console.log("Post/Upload profile image!");
  // ANCHOR
  let profileData = message.data;
  // let title = profileData.title;
  // console.log("Title: ", title);

  Model.userDetails.findOne(
    {
      email: profileData.email
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch user", err);
        callback(err, null);
      } else {
        if (result) {
          result.profileImage.push(profileData.name);
          result.save().then(
            doc => {
              console.log("New details added to this user profile", doc);
              let file = {
                folder: profileData.folder,
                filePath: profileData.filename,
                document: profileData.document
              };
              // FIXME Store assignment links in a table
              // Insert document using multer
              insertDocuments(Model, file, profileData.email, () => {
                callback(null, result);
              });
            },
            err => {
              console.log("Unable to save profile image details.", err);
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
