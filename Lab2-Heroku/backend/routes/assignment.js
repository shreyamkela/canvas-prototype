//Route to handle Get Request Call to show assignment submissions according to persona. If the persona is a student, this request returns all submissions for a particular assignment in a particular course, and if the persona is of a faculty, this request returns only the latest submissions for all students for a particular assignment, in a particular course
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");
const insertDocuments = require("../uploads/_helpers/insertDocuments");
const mongoose = require("mongoose");

router.get("/", function(req, res) {
  console.log("Get Assignment Data Called!");
  // ANCHOR
  let assignmentData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  Model.courseDetails.findOne(
    {
      courseId: assignmentData.courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch course", err);
      } else {
        if (user) {
          if (assignmentData.persona == 2) {
            for (key in results) {
              res.status(200).sendFile(__dirname + `${user.assignments[key].Path}`);
            }
          } else if (assignmentData.persona == 1) {
            res.status(200).sendFile(__dirname + `${user.assignments[0].Path}`);
          }
        } else {
          console.log("Unable to fetch course", err);
          res.status(400).send();
        }
      }
    }
  );
});

//Route to handle Post Request Call to create a new assignment if the persona is of a faculty, and submit an assignment, if the persona is of a student. We dont override the the previous submissions
router.post("/", function(req, res) {
  console.log("Create/Submit Assignment Data Posted!");
  // ANCHOR
  let assignmentData = req.body.data;

  if (assignmentData.persona === 1) {
    Model.courseDetails.findOne(
      {
        courseId: assignmentData.courseId
      },
      (err, user) => {
        if (err) {
          console.log("Unable to fetch course", err);
          res.status(400).send("Unable to save assignment details.");
        } else {
          if (user) {
            var id = mongoose.Types.ObjectId();
            assignmentData["assignmentId"] = id;
            delete assignmentData["courseId"];
            delete assignmentData["persona"];
            user.assignments.push(assignmentData);
            //console.log("XXXXXXXXXX", user.assignments);
            user.save().then(
              doc => {
                console.log("New details added to this course assignments", doc);
                res.status(200).send("Creation Successful!");
                //let file = {
                //       folder: assignmentData.folder,
                //       filePath: assignmentData.filename,
                //       document: assignmentData.document
                //     };
                //     // FIXME Store assignment links in a table
                //     // Insert document using multer
                //     insertDocuments(Model, file, assignmentData.courseId, assignmentData.email, () => {
                //       res.send("Creation Successful!");
                //     });
              },
              err => {
                console.log("Unable to save assignment details.", err);
                res.status(400).send("Unable to save assignment details.");
              }
            );
          } else {
            res.status(400).send("Unable to save assignment details.");
          }
        }
      }
    );
  } else if (assignmentData.persona === 2) {
    Model.courseDetails.findOne(
      {
        courseId: assignmentData.courseId
      },
      (err, user) => {
        if (err) {
          console.log("Unable to fetch course", err);
          res.status(400).send("Unable to save assignment details.");
        } else {
          if (user) {
            for (var i = 0; i < user.assignments.length; i++) {
              if (user.assignments[i].assignmentId == assignmentData.document.assignmentId) {
                if (user.assignments[i].submissions !== undefined) {
                  if (user.assignments[i].submissions[assignmentData.email] == undefined) {
                    user.assignments[i].submissions[assignmentData.email] = [];
                    user.assignments[i].submissions[assignmentData.email].push(assignmentData.document.file);
                  } else {
                    user.assignments[i].submissions[assignmentData.email].push(assignmentData.document.file);
                  }
                } else {
                  user.assignments[i].submissions = {};
                  user.assignments[i].submissions[assignmentData.email] = [];
                  user.assignments[i].submissions[assignmentData.email].push(assignmentData.document.file);
                }
              }
            }
            console.log("QQQQQQQQQQQQQQQQQ", user.assignments[1]);
            user.markModified("assignments"); // NOTE Sometimes the mongo db does not get updated even on using user.save(). Mongo is not able to detect changes and thus doesnt save. Therefore we hard modify the db with markModified so that it will be saved
            user.save().then(
              doc => {
                console.log("New details added to this users assignments");
                res.status(200).send("Upload Successful!");
              },
              err => {
                console.log("Unable to save assignment details.", err);
                res.status(400).send("Unable to upload assignment!");
              }
            );
            // for (const index of user.assignments) {
            //   console.log("KKKKKKKKKKKKK", user.assignments[index]);
            // }
            // var id = mongoose.Types.ObjectId();
            // assignmentData["assignmentId"] = id;
            // delete assignmentData["courseId"];
            // user.assignments.push(assignmentData);
            // //console.log("XXXXXXXXXX", user.assignments);
            // user.save().then(
            //   doc => {
            //     console.log("New details added to this course assignments", doc);
            //     res.status(200).send("Creation Successful!");
            //     //let file = {
            //     //       folder: assignmentData.folder,
            //     //       filePath: assignmentData.filename,
            //     //       document: assignmentData.document
            //     //     };
            //     //     // FIXME Store assignment links in a table
            //     //     // Insert document using multer
            //     //     insertDocuments(Model, file, assignmentData.courseId, assignmentData.email, () => {
            //     //       res.send("Creation Successful!");
            //     //     });
            //   },
            //   err => {
            //     console.log("Unable to save assignment details.", err);
            //     res.status(400).send("Unable to save assignment details.");
            //   }
            // );
          } else {
            res.status(400).send("Unable to save assignment details.");
          }
        }
      }
    );
  }
});

module.exports = router;
