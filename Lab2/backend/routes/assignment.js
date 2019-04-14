//Route to handle Get Request Call to show assignment submissions according to persona. If the persona is a student, this request returns all submissions for a particular assignment in a particular course, and if the persona is of a faculty, this request returns only the latest submissions for all students for a particular assignment, in a particular course
const express = require("express");
const router = express.Router();
const db = require("../database/mongoose");
const insertDocuments = require("../uploads/_helpers/insertDocuments");

router.get("/", function(req, res) {
  console.log("Get Assignment Data Called!");
  // ANCHOR
  let assignmentData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  if (assignmentData.persona == 2) {
    db.query(
      `SELECT * FROM assignments WHERE Email = '${assignmentData.email}' AND CourseId = '${assignmentData.courseId}' AND Name = '${
        assignmentData.name
      }'`,
      (err, results) => {
        if (err) throw err;
        if (results[0] !== undefined) {
          for (key in results) {
            res.status(200).sendFile(__dirname + `${results[key].Path}`);
          }
          // res.status(200).send(results[0]);
        } else {
          res.status(400).send();
        }
      }
    );
  } else if (assignmentData.persona == 1) {
    db.query(`SELECT * FROM courseEnrolments CourseId = '${assignmentData.courseId}'`, (err, results) => {
      if (err) throw err;
      if (results[0] !== undefined) {
        for (key in results) {
          db.query(
            `SELECT * FROM assignments WHERE Date in (SELECT Email, CourseId, Name, MAX(Date) FROM assignments WHERE Email = '${
              results[key].email
            }' AND CourseId = '${results[key].courseId}' AND Name = '${results[key].name}' GROUP BY Email)`,
            (err, results_1) => {
              if (results_1[0] !== undefined) {
                res.status(200).sendFile(__dirname + `${results_1[0].Path}`);
              } else {
                res.status(400).send();
              }
            }
          );
          //res.status(200).sendFile(__dirname + `${results[key].Path}`);
        }
        // res.status(200).send(results[0]);
      } else {
        res.status(400).send();
      }
    });
  }
});

//Route to handle Post Request Call to create a new assignment if the persona is of a faculty, and submit an assignment, if the persona is of a student. We dont override the the previous submissions
router.post("/", function(req, res) {
  console.log("Create/Submit Assignment Data Posted!");
  // ANCHOR
  let assignmentData = req.body.data;

  db.query(
    `INSERT INTO assignments (Name, Description, Email, CourseId, Path, DueBy, Points) VALUES ('${assignmentData.name}','${assignmentData.desc}','${
      assignmentData.email
    }','${assignmentData.courseId}', '${assignmentData.filePath}', '${assignmentData.dueBy}, '${assignmentData.points}'')`,
    err => {
      if (err) throw err;
      console.log("New details added to assignment table");
      let file = {
        folder: assignmentData.folder,
        filePath: assignmentData.filename,
        document: assignmentData.document
      };
      // FIXME Store assignment links in a table
      // Insert document using multer
      insertDocuments(db, file, assignmentData.courseId, assignmentData.email, () => {
        res.send("Creation Successful!");
      });
    }
  );
});

module.exports = router;
