//Route to handle Get Request Call to show all uploaded files for a particular course, irrespective of persona
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");
const insertDocuments = require("../uploads/_helpers/insertDocuments");

router.get("/", function(req, res) {
  console.log("Get all files data called!");

  // ANCHOR
  let filesData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  Model.courseDetails.findOne(
    {
      courseId: filesData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch course", err);
      } else {
        if (user) {
          console.log("Announcements detail: ", user);
          for (key in results) {
            res.status(200).sendFile(__dirname + `${user[key].files.Path}`);
          }
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

//Route to handle Post Request Call to upload a file for a particular course, by a faculty
router.post("/", function(req, res) {
  console.log("Post a file data posted!");
  // ANCHOR
  let filesData = req.body.data;
  // let title = filesData.title;
  // console.log("Title: ", title);

  Model.courseDetails.findOne(
    {
      courseId: filesData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch course", err);
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
                res.send("Creation Successful!");
              });
            },
            err => {
              console.log("Unable to save file details.", err);
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
