//Route to handle Get Request Call to get the profile picture
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");
const insertDocuments = require("../uploads/_helpers/insertDocuments");

router.get("/", function(req, res) {
  console.log("Get profile image!");
  // ANCHOR
  let profileData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  Model.userDetails.findOne(
    {
      email: profileData.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          res.status(200).sendFile(__dirname + `${user.profileImage.Path}`);
        } else {
          console.log("Unable to fetch profile image", err);
          res.status(400).send();
        }
      }
    }
  );
});

//Route to handle Post Request Call to post/upload the profile picture
router.post("/", function(req, res) {
  console.log("Post/Upload profile image!");
  // ANCHOR
  let profileData = req.body.data;
  // let title = profileData.title;
  // console.log("Title: ", title);

  Model.userDetails.findOne(
    {
      email: profileData.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          user.profileImage.push(profileData.name);
          user.save().then(
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
                res.send("Creation Successful!");
              });
            },
            err => {
              console.log("Unable to save profile image details.", err);
              res.status(400).send();
            }
          );
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

module.exports = router;
