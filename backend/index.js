//import the require dependencies
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

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
    activeDuration: 5 * 60 * 1000
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

// set a cookie
app.use(function(req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    console.log("Cookie does not exist");
    // res.cookie("cookie", "LoggedIn", {
    //   // Set the name 'cookie' to the cookie sent to client, when admin logs in. At react/client end, we can check whether the name is 'cookie' or not, to authenticate.
    //   // At react/client end, we check the cookie name using cookie.load('cookie') command of the 'react-cookies' library. If cookie.load('cookie') != null this means that the user is admin
    //   maxAge: 900000,
    //   httpOnly: false,
    //   path: "/"
    // });
    // console.log("cookie created successfully");
    // console.log("Cookie: ", cookie);
  } else {
    // yes, cookie was already present
    console.log("Cookie exists", cookie);
  }
  next(); // <-- important!
});

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
  console.log("Firstname, Lastname, Email, Password, Persona: ", firstname, lastname, email, password, persona);
  // Using an SQL quesy, check if Email is already present. If email not present then register, else show warning
  db.query(`SELECT Persona FROM Users WHERE Email = '${email}'`, (err, results) => {
    if (err) throw err;
    if (results[0] === undefined) {
      // if email not present, then register
      db.query(`INSERT INTO Users (Email, Password, Persona) VALUES ('${email}','${password}',${persona})`, (err, results) => {
        if (err) throw err;
        console.log("New details added to Users table");
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
  console.log("email & Password: ", email, password);

  // Using an SQL query, check if Email and password is present
  db.query(`SELECT Persona FROM Users WHERE Email = '${email}' AND BINARY Password = '${password}'`, (err, results) => {
    // Checing for password already present should be case sensitive - The password's case should also match - For this we use the keyword BINARY - https://stackoverflow.com/questions/5629111/how-can-i-make-sql-case-sensitive-string-comparison-on-mysql
    if (err) throw err;
    console.log(results);
    if (results[0] !== undefined) {
      // if present
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
          console.log("Faculty");
          res.end("Faculty Login Successful!");
          break;
        case 2:
          console.log("Student");
          res.end("Student Login Successful!");
          break;
      }
    } else {
      console.log("Incorrect email or password");
      res.send("Incorrect email or password");
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
      let { courseName, dept, descrip, room, classCap, waitlistCap, term } = courseData;
      console.log(id, courseName, dept, descrip, room, classCap, waitlistCap, term);
      db.query(
        `INSERT INTO Courses (Id, Name, Department, Description, Room, Capacity, Waitlist, Term) VALUES ('${id}','${courseName}','${dept}','${descrip}','${room}','${classCap}','${waitlistCap}','${term}')`,
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
  console.log("Get Courses data...");
  db.query(`SELECT Id, Name FROM Courses`, (err, results) => {
    if (err) throw err;
    console.log(results);
    if (results[0] !== undefined) {
      res.send(results);
    } else {
      console.log("No courses available.");
      res.send("noCourses");
    }
  });
});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
