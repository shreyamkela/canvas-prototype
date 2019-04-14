const multer = require("multer");

// ANCHOR
// multer file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/${req.folderName}`);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
const upload = multer({ storage: storage });

// ANCHOR
// Insert file link into the db
module.exports = insertDocuments = function(Model, file, courseId, email, callback) {
  console.log("Insert file link called!");

  Model.courseDetails.findOne(
    {
      courseId: courseId
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch course", err);
      } else {
        if (user) {
          user.files.email.push(email);
          user.files.courseId.push(courseId);
          user.files.path.push(`../${file.folder}/${file.filePath}`);
          user.files.folder.push(announcementData);
          user.save().then(
            doc => {
              console.log("New details added to this course files", doc);
              res.send("addition Successful!");
              callback(user);
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
};
