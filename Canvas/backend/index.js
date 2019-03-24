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
      db.query(`INSERT INTO FullNames (Email, Firstname, Lastname) VALUES ('${email}','${firstname}','${lastname}')`, err => {
        if (err) throw err;
        console.log("New details added to Fullnames table");
      });
      res.send("Registration Successful!");
    } else {
      console.log("Email already registered");
      res.send("Email already registered");
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
              res.end("Faculty Login Successful!");
              break;
            case 2:
              console.log("Student Login Successful!");
              res.end("Student Login Successful!");
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
        `INSERT INTO Courses (Id, Name, Department, Description, Room, Capacity, Waitlist, Term, Email) VALUES ('${id}','${courseName}','${dept}','${descrip}','${room}','${classCap}','${waitlistCap}','${term}', '${email}')`,
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
        res.send(results);
      } else {
        console.log("No courses available.");
        res.send("noCourses");
      }
    });
  } else if (req.query.persona === "2") {
    console.log("Get Courses data for student...", req.query);
    const email = req.query.email; // Selecting only those courses to send to frontend, that have been created by the logged in faculty
    db.query(`SELECT CourseId FROM courseEnrolments WHERE StudentEmail = '${email}'`, (err, results) => {
      if (err) throw err;
      console.log("Student is enrolled in the following course ids:", results);
      if (results[0] !== undefined) {
        for (var key in results) {
          db.query(`SELECT Id, Name FROM Courses WHERE Id = '${results[key].CourseId}'`, (err, results_1) => {
            if (err) throw err;
            console.log("Student with this email is enrolled in the following courses:", results_1);
            res.send(results_1);
          });
        }
      } else {
        console.log("No courses available.");
        res.send("noCourses");
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
    db.query(`SELECT Id, Name, CapacityUsed, WaitlistUsed  FROM Courses`, (err, results) => {
      if (err) throw err;
      if (results[0] !== undefined) {
        for (var key in results) {
          let currentId = results[key].Id.toLowerCase();
          switch (filterBy) {
            case "1":
              if (currentId === searchValue) {
                searchedCourses.push(results[key]);
                console.log("searchedCourses", searchedCourses);
                if (searchedCourses == []) {
                  console.log("No courses available.");
                  res.send("noCourses");
                } else {
                  res.send(searchedCourses);
                }
              }
              break;
            case "2":
              if (currentId > searchValue) {
                searchedCourses.push(results[key]);
                console.log("searchedCourses", searchedCourses);
                if (searchedCourses == []) {
                  console.log("No courses available.");
                  res.send("noCourses");
                } else {
                  res.send(searchedCourses);
                }
              }
              break;
            case "3":
              if (currentId < searchValue) {
                searchedCourses.push(results[key]);
                console.log("searchedCourses", searchedCourses);
                if (searchedCourses == []) {
                  console.log("No courses available.");
                  res.send("noCourses");
                } else {
                  res.send(searchedCourses);
                }
              }
              break;
          }
        }
      }
    });
  } else if (searchByQuery === "Term" || searchByQuery === "Name") {
    db.query(`SELECT Id, Name, CapacityUsed, WaitlistUsed, Term FROM Courses`, (err, results) => {
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

  db.query(
    `SELECT Title, Description FROM Announcements WHERE CourseId = '${announcementData.courseId}' AND Email = '${announcementData.email}'`,
    (err, results) => {
      if (err) throw err;
      console.log("Announcements for this Email and CourseId:", results);
      res.send(results);
    }
  );
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

// let temp = {
//   "About me": "Software Engineering graduate student at SJSU",
//   Gender: "Male",
//   "Contact No": 6699887766,
//   City: "San Jose",
//   Country: "United States",
//   Company: "An Awesome Company",
//   School: "An Awesome School",
//   Hometown: "An Awesome Hometown",
//   Languages: "English, Hindi"
// };
// console.log(JSON.stringify(temp, undefined, 2));

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
