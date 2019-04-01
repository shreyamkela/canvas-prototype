//import the require dependencies
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

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

// FIXME Add get routes in all as well?

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

//Route to handle Post Request Call to create a new assignment
app.post("/assignment", function(req, res) {
  console.log("Create Assignment Data Posted!");
  // let announcementData = req.body.data;
  // // let title = announcementData.title;
  // // console.log("Title: ", title);

  // db.query(
  //   `INSERT INTO Announcements (Title, Description, Email, CourseId) VALUES ('${announcementData.title}','${announcementData.desc}','${
  //     announcementData.email
  //   }','${announcementData.courseId}')`,
  //   err => {
  //     if (err) throw err;
  //     console.log("New details added to Announcement table");
  //     res.send("Creation Successful!");
  //   }
  // );
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

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
