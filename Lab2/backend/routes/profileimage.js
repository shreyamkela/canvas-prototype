//Route to handle Get Request Call to get the profile picture
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");
const insertDocuments = require("../uploads/_helpers/insertDocuments");

router.get("/", function(req, res) {
  console.log("Get profile image!");
  // ANCHOR
  let profileData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT Path FROM Files WHERE Email = '${profileData.email}' AND Folder = '${profileData.folder}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Profile image sent");
      res.status(200).sendFile(__dirname + `${results[0].Path}`);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Post Request Call to post/upload the profile picture
router.post("/", function(req, res) {
  console.log("Post/Upload profile image!");
  // ANCHOR
  let profileData = req.body.data;
  // let title = profileData.title;
  // console.log("Title: ", title);

  let file = {
    folder: assignmentData.folder,
    filePath: assignmentData.filename,
    document: assignmentData.document
  };

  db.query(`INSERT INTO Profile (Path) VALUES ('${file.filePath}')`, err => {
    if (err) throw err;
    console.log("New details added to profile table");

    // Insert document using multer
    insertDocuments(Model, file, profileData.courseId, profileData.email, () => {
      res.send("Upload Successful!");
    });
  });
});

module.exports = router;
