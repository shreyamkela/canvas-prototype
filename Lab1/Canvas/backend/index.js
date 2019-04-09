//import the require dependencies
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const multer = require("multer");

const app = express();
const saltRounds = 10; // for bcrypt

// FIXME Use the structure of webstorm/rohit bhaiya repo for backend

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//app.set("view engine", "ejs");

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_canvas_app",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 60 * 60 * 1000
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

// // set a cookie
// app.use(function(req, res, next) {
//   // check if client sent cookie
//   var cookie = req.cookies.cookieName;
//   if (cookie === undefined) {
//     console.log("Cookie does not exist");
//     // res.cookie("cookie", "LoggedIn", {
//     //   // Set the name 'cookie' to the cookie sent to client, when admin logs in. At react/client end, we can check whether the name is 'cookie' or not, to authenticate.
//     //   // At react/client end, we check the cookie name using cookie.load('cookie') command of the 'react-cookies' library. If cookie.load('cookie') != null this means that the user is admin
//     //   maxAge: 900000,
//     //   httpOnly: false,
//     //   path: "/"
//     // });
//     // console.log("cookie created successfully");
//     // console.log("Cookie: ", cookie);
//   } else {
//     // yes, cookie was already present
//     console.log("Cookie exists", cookie);
//   }
//   next(); // <-- important!
// });

//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "canvas"
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected...");
});

// ANCHOR
// multer file upload
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/${req.folderName}`);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
var upload = multer({ storage: storage });

// ANCHOR
// Insert file link into the db
var insertDocuments = function(db, file, courseId, email, callback) {
  console.log("Insert file link called!");

  db.query(
    `INSERT INTO Files (Email, CourseId, Path, Folder) VALUES ('${email}', '${courseId}', 'public/${file.folder}/${file.filePath}', '${
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

//Route to handle Post Request Call to add a new user
app.post("/newuser", function(req, res) {
  console.log("New User Details Posted!");
  let newUserDetails = req.body;
  let firstname = newUserDetails.data.firstname;
  let lastname = newUserDetails.data.lastname;
  let email = newUserDetails.data.email;
  let password = newUserDetails.data.password;
  let persona = newUserDetails.data.persona;
  console.log("Firstname, Lastname, Email, Unhashed Password, Persona: ", firstname, lastname, email, password, persona);
  // Using an SQL quesy, check if Email is already present. If email not present then register, else show warning
  db.query(`SELECT Persona FROM Users WHERE Email = '${email}'`, (err, results) => {
    if (err) throw err;
    if (results[0] === undefined) {
      // if email not present, then only register
      // Save hashed passwrod into db using bcrypt
      bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        db.query(`INSERT INTO Users (Email, Password, Persona) VALUES ('${email}','${hash}',${persona})`, (err, results) => {
          if (err) throw err;
          console.log("New details added to Users table");
        });
      });
      db.query(`INSERT INTO Profile (Email, Firstname, Lastname) VALUES ('${email}','${firstname}','${lastname}')`, err => {
        if (err) throw err;
        console.log("New details added to Profile table");
      });
      res.status(200).send("Registration Successful!"); // status should come before send
    } else {
      console.log("Email already registered!");
      res.status(400).send("Email already registered!"); // Bad request - Catch this error at frontend axios
    }
  });
});

//Route to handle Post Request Call to login an existing user
app.post("/login", function(req, res) {
  console.log("Login Data Posted!");
  let loginData = req.body;
  let email = loginData.data.email;
  let password = loginData.data.password;
  console.log("email & Unhashed Password: ", email, password);

  // Hashing the input password so that it can be compared with the hashed password stored in the db for this email - BUT THIS DOESNT WORK AS EVEN IF THE PASSWORD IS SAME< IF WE USE bcrypt.hash, THE SALT WOULD BE DIFFERENT AND THEREFORE HASHED VERSION WOULD BE DIFFERENT
  // let hashedPassword = null;
  // bcrypt.hash(password, saltRounds, function(err, hash) {
  //   if (err) throw err;
  //   hashedPassword = hash;
  //   console.log(hashedPassword, hash);
  // });

  // Using an SQL query, check if Email and password is present
  // db.query(`SELECT Persona FROM Users WHERE Email = '${email}' AND BINARY Password = '${password}'`, (err, results) => {
  // Checking for password already present should be case sensitive - The password's case should also match - For this we use the keyword BINARY - https://stackoverflow.com/questions/5629111/how-can-i-make-sql-case-sensitive-string-comparison-on-mysql
  db.query(`SELECT Password, Persona FROM Users WHERE Email = '${email}' `, (err, results) => {
    if (err) throw err;
    console.log(results);
    if (results[0] !== undefined) {
      // if email present
      bcrypt.compare(password, results[0].Password, function(err, comparisonResult) {
        if (comparisonResult == true) {
          // If password correct
          let persona = results[0].Persona;
          console.log("Persona: ", persona);
          res.cookie("cookie", "LoggedIn", {
            // Set the name 'cookie' to the cookie sent to client, when admin logs in. At react/client end, we can check whether the name is 'cookie' or not, to authenticate.
            // At react/client end, we check the cookie name using cookie.load('cookie') command of the 'react-cookies' library. If cookie.load('cookie') != null this means that the user is admin
            maxAge: 900000,
            httpOnly: false,
            path: "/"
          });
          switch (persona) {
            case 1:
              console.log("Faculty Login Successful!");
              res.send("Faculty Login Successful!");
              break;
            case 2:
              console.log("Student Login Successful!");
              res.send("Student Login Successful!");
              break;
          }
        } else {
          console.log("Incorrect password!");
          res.send("Incorrect password!");
        }
      });
    } else {
      console.log("Email does not exist!");
      res.send("Email does not exist!");
    }
  });
});

//Route to handle Get Request Call to load all details of profile
app.get("/profile", function(req, res) {
  console.log("Get Profile Data Called!");
  let profileData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM profile WHERE Email = '${profileData.email}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Profile data for this Email:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Post Request Call to edit profile
app.post("/profile", function(req, res) {
  console.log("Edit Profile Data Posted!");
  let profileData = req.body.data;
  console.log(profileData);

  db.query(
    `UPDATE profile SET AboutMe = '${profileData.AboutMe}', Gender='${profileData.Gender}', ContactNo='${profileData.ContactNo}', City='${
      profileData.City
    }', Country='${profileData.Country}', Company='${profileData.Company}', School='${profileData.School}', Hometown='${
      profileData.Hometown
    }', Languages= '${profileData.Languages}' WHERE Email = '${profileData.email}'`,
    err => {
      if (err) throw err;
      console.log("New details added to Profile table");
      res.send("Edit Successful!");
    }
  );
});

//Route to handle Post Request Call to create a new course
app.post("/createcourse", function(req, res) {
  console.log("Create Course Data Posted!");
  let courseData = req.body.data;
  let id = courseData.courseId;
  console.log("Id: ", id);

  db.query(`SELECT Name FROM Courses WHERE Id = '${id}'`, (err, results) => {
    if (err) throw err;
    console.log(results);
    console.log(results[0]);
    if (results[0] === undefined) {
      // if not present
      let { courseName, dept, descrip, room, classCap, waitlistCap, term, email } = courseData;
      console.log(id, courseName, dept, descrip, room, classCap, waitlistCap, term, email);
      db.query(
        `INSERT INTO Courses (Id, Name, Department, Description, Room, Capacity, Waitlist, CapacityUsed, WaitlistUsed, Term, Email) VALUES ('${id}','${courseName}','${dept}','${descrip}','${room}','${classCap}','${waitlistCap}', '0', '0', '${term}', '${email}')`,
        err => {
          if (err) throw err;
          console.log("New details added to Courses table");
        }
      );
      res.send("Creation Successful!");
    } else {
      console.log("Course id already present!"); //FIXME Make page stay on frontend if course id already present
      res.send("Course id already present!");
    }
  });
});

//Route to handle Get Request Call to get all courses for faculty/student depending upon the persona
app.get("/getcourses", function(req, res) {
  if (req.query.persona === "1") {
    // Persona is of faculty
    console.log("Get Courses data for faculty...", req.query);
    const email = req.query.email; // Selecting only those courses to send to frontend, that have been created by the logged in faculty
    db.query(`SELECT Id, Name FROM Courses WHERE Email = '${email}'`, (err, results) => {
      if (err) throw err;
      console.log(results);
      if (results[0] !== undefined) {
        res.status(200).send(results);
      } else {
        console.log("No courses available.");
        res.send("noCourses");
      }
    });
  } else if (req.query.persona === "2") {
    console.log("Get Courses data for student...", req.query);
    const email = req.query.email; // Selecting only those courses to send to frontend, that have been created by the logged in faculty
    db.query(`SELECT CourseId FROM courseEnrolments WHERE StudentEmail = '${email}'`, (err, results) => {
      // Fetch all courseIds of enrolled courses
      if (err) throw err;
      console.log("Student is enrolled in the following course ids:", results);
      if (results[0] !== undefined) {
        let allCourses = [];
        let temp = 0;
        for (var key in results) {
          // Fetch the details of all keys, i.e enrolled courses, in a loop and push them into an array. Return the array at the end
          db.query(`SELECT Id, Name FROM Courses WHERE Id = '${results[key].CourseId}'`, (err, results_1) => {
            if (err) throw err;
            allCourses.push(results_1[0]); // results_1 has the data at its 0th index everytime therefore we just push the data into our array and not the index+data
            temp++;
            if (temp === results.length) {
              console.log("Student with this email is enrolled in the following courses:", allCourses);
              res.status(200).send(allCourses); // NOTE - db.query is an async task and will take time. res.status(200).send(allCourses) should happen only on the last iteration of the loop. And in that loop, it should happen after the db.query returns.
              //A code below db.query might run before db.query returns therefore the res.send has to be kept in sunc with db.query therefore we put the res.end inside db.query and put a condition to only res.end if it is the last query
            }
          });
        }
      } else {
        console.log("No courses available.");
        res.end("noCourses");
      }
    });
  }
});

//Route to handle Get Request Call to search all courses for a student based on their query
app.get("/searchcourses", function(req, res) {
  console.log("Search Courses data for the query...", req.query);
  let searchValue = req.query.searchValue.toLowerCase(); // Selecting only those courses to send to frontend, that have been created by the logged in faculty. We make the search query lowercase and will compare with items that will also be made lowercase
  const filterBy = req.query.filterRadioValue;
  const searchBy = req.query.searchByRadioValue;
  let searchedCourses = [];
  let searchByQuery = null;

  switch (searchBy) {
    case "id":
      searchByQuery = "Id";
      break;
    case "term":
      searchByQuery = "Term";
      break;
    case "name":
      searchByQuery = "Name";
      break;
  }

  if (searchByQuery === "Id") {
    db.query(`SELECT Id, Name, Description, Capacity, Waitlist, CapacityUsed, WaitlistUsed FROM Courses`, (err, results) => {
      if (err) throw err;
      if (results[0] !== undefined) {
        for (var key in results) {
          let currentId = results[key].Id.toLowerCase();
          switch (filterBy) {
            case "1":
              if (currentId === searchValue) {
                searchedCourses.push(results[key]);
                console.log("searchedCourses", searchedCourses);
              }
              break;
            case "2":
              if (currentId > searchValue) {
                searchedCourses.push(results[key]);
                console.log("searchedCourses", searchedCourses);
              }
              break;
            case "3":
              if (currentId < searchValue) {
                searchedCourses.push(results[key]);
                console.log("searchedCourses", searchedCourses);
              }
              break;
          }
        }
        if (searchedCourses == []) {
          console.log("No courses available.");
          res.send("noCourses");
        } else {
          res.send(searchedCourses);
        }
      } else {
        console.log("No courses available.");
        res.send("noCourses");
      }
    });
  } else if (searchByQuery === "Term" || searchByQuery === "Name") {
    db.query(`SELECT Id, Name, Description, Capacity, Waitlist, CapacityUsed, WaitlistUsed, Term FROM Courses`, (err, results) => {
      if (err) throw err;
      if (results[0] !== undefined) {
        for (var key in results) {
          if (searchByQuery === "Term") {
            let currentTerm = results[key].Term.toLowerCase();
            if (currentTerm.includes(searchValue)) {
              searchedCourses.push(results[key]);
            }
          } else {
            let currentTerm = results[key].Name.toLowerCase();
            if (currentTerm.includes(searchValue)) {
              searchedCourses.push(results[key]);
            }
          }
        }
        if (searchedCourses === []) {
          console.log("No courses available.");
          res.send("noCourses");
        } else {
          console.log("searchedCourses", searchedCourses);
          res.send(searchedCourses);
        }
      } else {
        console.log("No courses available.");
        res.send("noCourses");
      }
    });
  }
});

//Route to handle Get Request Call to load all announcements for the faculty email and courseId
app.get("/announcement", function(req, res) {
  console.log("Get Announcement Data Called! Announcement Data:", req.query);
  let announcementData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  db.query(`SELECT Title, Description FROM Announcements WHERE CourseId = '${announcementData.courseId}'`, (err, results) => {
    if (err) throw err;
    console.log("Announcements for this CourseId:", results);
    res.send(results);
  });
});

//Route to handle Post Request Call to create a new announcement
app.post("/announcement", function(req, res) {
  console.log("Create Announcement Data Posted!");
  let announcementData = req.body.data;
  // let title = announcementData.title;
  // console.log("Title: ", title);

  db.query(
    `INSERT INTO Announcements (Title, Description, Email, CourseId) VALUES ('${announcementData.title}','${announcementData.desc}','${
      announcementData.email
    }','${announcementData.courseId}')`,
    err => {
      if (err) throw err;
      console.log("New details added to Announcement table");
      res.send("Creation Successful!");
    }
  );
});

//Route to handle Post Request Call to enroll into a course and increment the capacity used
app.post("/enroll", function(req, res) {
  console.log("Enrolling into a course!");
  let enrollData = req.body.data;
  console.log("Enroll data: ", enrollData);

  let alreadyEnrolled = false;
  let alreadyWaitlisted = false;
  if (enrollData.courseId != undefined) {
    // First we check if enrollData.courseId is undefined
    // Then we check whether this course is already enrolled
    // Then we check whether this course is already waitlisted
    // Then we insert
    db.query(`SELECT * FROM courseenrolments WHERE CourseId = '${enrollData.courseId}'`, (err, results) => {
      if (err) throw err;
      console.log(results);
      for (var key in results) {
        if (results[key].StudentEmail == enrollData.email) {
          // If already enrolled then throw error
          console.log("Course already enrolled for this email!");
          alreadyEnrolled = true;
          res.status(400).end("Course already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
          break;
        }
      }
      if (alreadyEnrolled !== true) {
        db.query(`SELECT * FROM coursewaitlists WHERE CourseId = '${enrollData.courseId}'`, (err, results_waitlists) => {
          if (err) throw err;
          for (var key in results_waitlists) {
            if (results_waitlists[key].StudentEmail == enrollData.email) {
              // If already waitlisted then throw error
              console.log("Cannot enroll as course is already waitlisted for this email!");
              alreadyWaitlisted = true;
              res.status(400).end("Cannot enroll as course is already waitlisted!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
              break;
            }
          }
          if (alreadyWaitlisted !== true) {
            db.query(`INSERT INTO courseenrolments (CourseId, StudentEmail) VALUES ('${enrollData.courseId}','${enrollData.email}')`, err => {
              if (err) throw err;
              console.log("New details added to courseenrolments table");
            });
            db.query(`SELECT CapacityUsed FROM courses WHERE Id= '${enrollData.courseId}'`, (err, results_courses) => {
              if (err) throw err;
              // Increment the capacityUsed
              let capacityUsed = results_courses[0].CapacityUsed + 1;
              db.query(`UPDATE courses SET CapacityUsed = '${capacityUsed}' WHERE Id = '${enrollData.courseId}'`, err => {
                if (err) throw err;
                console.log("CapacityUsed updated in the courses table");
                res.status(200).end("Course enrolled!");
              });
            });
          }
        });
      }
    });
  }
});

//Route to handle Post Request Call to waitlist a course, increment the waitlist used, and FIXME send a notification to faculty that waitlists exist
app.post("/waitlist", function(req, res) {
  console.log("Waitlisting into a course!");
  let waitlistData = req.body.data;
  console.log("Waitlist data: ", waitlistData);

  let alreadyEnrolled = false;

  let alreadyWaitlisted = false;
  if (waitlistData.courseId != undefined) {
    // First we check if waitlistData.courseId is undefined
    // Then we check whether this course is already waitlisted
    // Then we check whether this course is already enrolled
    // Then we insert
    db.query(`SELECT * FROM coursewaitlists WHERE CourseId = '${waitlistData.courseId}'`, (err, results) => {
      if (err) throw err;
      console.log(results);
      for (var key in results) {
        if (results[key].StudentEmail == waitlistData.email) {
          console.log("Course already waitlisted for this email!");
          alreadyWaitlisted = true;
          res.status(400).end("Course already waitlisted!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
          break;
        }
      }
      if (alreadyWaitlisted !== true) {
        db.query(`SELECT * FROM courseenrolments WHERE CourseId = '${waitlistData.courseId}'`, (err, results_enrolled) => {
          if (err) throw err;
          for (var key in results_enrolled) {
            if (results_enrolled[key].StudentEmail == waitlistData.email) {
              // If already enrolled then throw error
              console.log("Cannot waitlist as course is already enrolled for this email!");
              alreadyEnrolled = true;
              res.status(400).end("Cannot waitlist as course is already enrolled!"); // res.end will end the response here and dont go futher in this post request? But this doesnt work here why? return res.end also doesnt work if a db.query is after this db.query
              break;
            }
          }
          if (alreadyEnrolled !== true) {
            db.query(`INSERT INTO coursewaitlists (CourseId, StudentEmail) VALUES ('${waitlistData.courseId}','${waitlistData.email}')`, err => {
              if (err) throw err;
              console.log("New details added to coursewaitlists table");
            });
            db.query(`SELECT WaitlistUsed FROM courses WHERE Id= '${waitlistData.courseId}'`, (err, results_courses) => {
              if (err) throw err;
              // Increment the WaitlistUsed
              let waitlistUsed = results_courses[0].WaitlistUsed + 1;
              db.query(`UPDATE courses SET WaitlistUsed = '${waitlistUsed}' WHERE Id = '${waitlistData.courseId}'`, err => {
                if (err) throw err;
                console.log("WaitlistUsed updated in the courses table");
                res.status(200).end("Course waitlisted!");
              });
            });
          }
        });
      }
    });
  }
});

// ANCHOR //Route to handle Post Request Call to drop a course by a student
app.post("/dropcourse", function(req, res) {
  console.log("Drop a course data posted!");
  // ANCHOR
  let courseData = req.body.data;
  // let title = courseData.title;
  // console.log("Title: ", title);

  db.query(`DELETE FROM courses WHERE Email = '${courseData.email}'`, err => {
    if (err) throw err;
    res.send("Delete Successful!");
  });
});

//Route to handle Get Request Call to get the profile picture
app.get("/profileimage", function(req, res) {
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
app.post("/profileimage", function(req, res) {
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
    insertDocuments(db, file, profileData.courseId, profileData.email, () => {
      res.send("Upload Successful!");
    });
  });
});

//Route to handle Get Request Call show all students that are on the waitlist and require permission numbers, for a particular course
app.get("/permissionnumber", function(req, res) {
  console.log("Get waitlist/permission number data!");
  // ANCHOR
  let waitlistData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM waitlist WHERE CourseId = '${waitlistData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("waitlist data for this course:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Post Request Call to provide permission number to select students that are on the waitlist, for a particular course
//When a student a selected for permission number, we enroll them in the course. No extra functionality specified in the problem statement.
app.post("/permissionnumber", function(req, res) {
  console.log("Post permission number data!");
  // ANCHOR
  let waitlistData = req.body.data;
  // let title = waitlistData.title;
  // console.log("Title: ", title);

  db.query(`INSERT INTO courseEnrolments (Email, CourseId) VALUES ('${waitlistData.email}','${waitlistData.courseId}')`, err => {
    if (err) throw err;
    console.log("New details added to enrolled table");
    res.send("Addition Successful!");
  });
});

//Route to handle Get Request Call to show assignments created in a particular course. If persona is student, show whether an assignment is submitted or not. If the persona is faculty, show all the assignments created.
app.get("/allassignments", function(req, res) {
  console.log("Get All Assignments Data Called!");
  // ANCHOR
  let assignmentData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM assignments WHERE CourseId = '${assignmentData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      //console.log("assignments data for this course:", results[0]);
      for (key in results) {
        res.status(200).sendFile(__dirname + `${results[key].Path}`);
      }
      // res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Get Request Call to show assignment submissions according to persona. If the persona is a student, this request returns all submissions for a particular assignment in a particular course, and if the persona is of a faculty, this request returns only the latest submissions for all students for a particular assignment, in a particular course
app.get("/assignment", function(req, res) {
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
app.post("/assignment", function(req, res) {
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

//Route to handle Get Request Call to show quizzes created in a particular course. If persona is student, show whether an quiz is submitted or not. If the persona is faculty, show all the quizzes created.
app.get("/allquizzes", function(req, res) {
  console.log("Get All Quizzes Data Called!");
  // ANCHOR
  let quizData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM quiz WHERE CourseId = '${quizData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Quiz data for this course id:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Get Request Call to show quiz submissions according to persona. If the persona is a student, this request returns the submission for a particular quiz in a particular course, and if the persona is of a faculty, this request returns only the submissions for all students for a particular quiz, in a particular course
app.get("/quiz", function(req, res) {
  console.log("Get Quiz Data Called!");
  // ANCHOR
  let quizData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  if (quizData.persona == 2) {
    db.query(
      `SELECT * FROM userquiz WHERE Email = '${quizData.email}' AND CourseId = '${quizData.courseId}' AND Name = '${quizData.name}'`,
      (err, results) => {
        if (err) throw err;
        if (results[0] !== undefined) {
          console.log("User quiz data for this Email:", results[0]);
          res.status(200).send(results[0]);
        } else {
          res.status(400).send();
        }
      }
    );
  } else {
    db.query(`SELECT * FROM userquiz CourseId = '${quizData.courseId}' AND Name = '${quizData.name}'`, (err, results) => {
      if (err) throw err;
      if (results[0] !== undefined) {
        console.log("All students quiz data for this course and quiz:", results);
        res.status(200).send(results[0]);
      } else {
        res.status(400).send();
      }
    });
  }
});

//Route to handle Get Request Call to show questions and options to a student for a particular quiz.
app.get("/takequiz", function(req, res) {
  console.log("Take a Quiz get data called!");

  // ANCHOR
  let quizData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM quiz WHERE Name = '${quizData.name}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Quiz data for this quiz name:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Post Request Call to create a new quiz if the persona is of a faculty, and submit an quiz, if the persona is of a student.
app.post("/quiz", function(req, res) {
  console.log("Create/Submit Quiz Data Posted!");
  // ANCHOR
  let quizData = req.body.data;
  if (quizData.persona == 2) {
    db.query(
      `INSERT INTO userquiz (Email, CourseId, Options, Name) VALUES ('${quizData.email}','${quizData.courseId}', '${quizData.options}', '${
        quizData.name
      }')`,
      err => {
        if (err) throw err;
        console.log("New details added to user quiz table");
        res.send("Submission Successful!");
      }
    );
  } else if (quizData.persona == 1) {
    db.query(
      `INSERT INTO quiz (Email, CourseId, Questions, Options, Answers) VALUES ('${quizData.email}','${quizData.courseId}','${quizData.questions}', '${
        quizData.options
      }'),'${quizData.answers}'`,
      err => {
        if (err) throw err;
        console.log("New details added to quiz table");
        res.send("Creation Successful!");
      }
    );
  }
});

//Route to handle Get Request Call to get all grades for a particular course, for a student
app.get("/allgrades", function(req, res) {
  console.log("Get all grades for this course called!");

  // ANCHOR
  let gradeData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM grade WHERE Email = '${gradeData.email}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Grade data for this Email:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Get Request Call to show grade for an assignment or a quiz of a student, for a particular course
app.get("/grade", function(req, res) {
  console.log("Get an assignment/quiz grade data called!");

  // ANCHOR
  let gradeData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM grade WHERE Email = '${gradeData.email}' AND CourseId = '${gradeData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Grade data for this Email and Course Id:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Post Request Call to grade an assignment or a quiz or a particular student, by a faculty
app.post("/grade", function(req, res) {
  console.log("Grade an assignment/quiz data posted!");
  // ANCHOR
  let gradeData = req.body.data;

  // gradeData.type defines whether the submission is an assignment or a quiz
  db.query(
    `INSERT INTO grade (Email, CourseId, StduentEmail, Grade, Name, Type) VALUES ('${gradeData.email}','${gradeData.courseId}','${
      gradeData.studentEmail
    }','${gradeData.grade}', '${gradeData.name}', '${gradeData.type}')`,
    err => {
      if (err) throw err;
      console.log("New details added to grade table");
      res.send("Grading Successful!");
    }
  );
});

//Route to handle Get Request Call to show all uploaded files for a particular course, irrespective of persona
app.get("/files", function(req, res) {
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
app.post("/files", function(req, res) {
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

//Route to handle Get Request Call to show all people registered for a particular course. Personas can also be save in people table and therefore, we can send faculty name as a seperate key in the json response so that it can be shown on the frontend with a faculty tag.
app.get("/people", function(req, res) {
  console.log("Get all people data called!");

  // ANCHOR
  let peopleData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM courseEnrolments WHERE CourseId = '${peopleData.courseId}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("People data for this course id:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

//Route to handle Post Request Call to remove a student from a course, by a faculty
app.post("/people", function(req, res) {
  console.log("Remove a student from people data posted!");
  // ANCHOR
  let peopleData = req.body.data;
  // let title = peopleData.title;
  // console.log("Title: ", title);

  db.query(`DELETE FROM courseEnrolments WHERE Email = '${peopleData.email}' AND CourseId = '${peopleData.courseId}'`, err => {
    if (err) throw err;
    console.log("Removed this course for the student in courseEnrolments table");
    res.send("Removal Successful!");
  });
});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
