//Route to handle Get Request Call to show all uploaded files for a particular course, irrespective of persona
const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const insertDocuments = require("../uploads/_helpers/insertDocuments");

router.get("/", function(req, res) {
  console.log("Get all files data called!");

  // ANCHOR
  let filesData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM files WHERE CourseId = '${filesData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      for (key in results) {
        res.status(200).sendFile(__dirname + `${results[key].Path}`);
      }
      // res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Post Request Call to upload a file for a particular course, by a faculty
router.post("/", function(req, res) {
  console.log("Post a file data posted!");
  // ANCHOR
  let filesData = req.body.data;
  // let title = filesData.title;
  // console.log("Title: ", title);

  db.query(
    `INSERT INTO files (Title, Email, CourseId, Path) VALUES ('${filesData.title}',${filesData.email}','${filesData.courseId}', '${
      filesData.filePath
    }')`,
    err => {
      if (err) throw err;
      console.log("New details added to files table");
      let file = {
        folder: filesData.folder,
        filePath: filesData.filename,
        document: filesData.document
      };
      // FIXME Store files links in a table
      // Insert document using multer
      insertDocuments(db, file, filesData.courseId, filesData.email, () => {
        res.send("Upload Successful!");
      });
    }
  );
});

module.exports = router;
