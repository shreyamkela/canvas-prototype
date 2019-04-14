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

  db.query(
    `INSERT INTO Files (Email, CourseId, Path, Folder) VALUES ('${email}', '${courseId}', '../../uploads/${file.folder}/${file.filePath}', '${
      file.folder
    }'  )`,
    err => {
      if (err) throw err;
      console.log("New details added to Files table");
      res.send("Addition Successful!");
      callback(result);
    }
  );
};
