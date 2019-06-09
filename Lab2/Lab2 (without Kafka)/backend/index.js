//import the require dependencies
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

//Passport authentication
const passport = require("passport");
const origin = "https://limitless-plateau-82992.herokuapp.com";

// FIXME Use the structure of webstorm repo for backend

//use cors to allow cross origin resource sharing
app.use(cors({ origin: `${origin}`, credentials: true }));

//app.set("view engine", "ejs");

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_canvas_app",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 60 minutes
    activeDuration: 5 * 60 * 1000
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", `${origin}`);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.use(passport.initialize());

// Passport Strategy
require("./config/passport")(passport);

// Routing
var newuser = require("./routes/newuser");
var login = require("./routes/login");
var getOrPostProfile = require("./routes/profile");
var createcourse = require("./routes/createcourse");
var getcourses = require("./routes/getcourses");
var searchcourses = require("./routes/searchcourses");
var getOrPostAnnouncement = require("./routes/announcement");
var enroll = require("./routes/enroll");
var waitlist = require("./routes/waitlist");
// ANCHOR
var dropcourse = require("./routes/dropcourse");
var getOrPostProfileImage = require("./routes/profileimage");
var getOrPostPermissionnumber = require("./routes/permissionnumber");
var allassignments = require("./routes/allassignments");
var getOrPostAssignment = require("./routes/assignment");
var allquizzes = require("./routes/allquizzes");
var getOrPostQuiz = require("./routes/quiz");
var takequiz = require("./routes/takequiz");
//var allgrades = require("./routes/allgrades");
var grade = require("./routes/grade");
var files = require("./routes/files");
var people = require("./routes/people");
var getOrPostMessages = require("./routes/messages");

// Route configurations
app.use("/newuser", newuser);
app.use("/login", login);
app.use("/profile", getOrPostProfile);
app.use("/createcourse", createcourse);
app.use("/getcourses", getcourses);
app.use("/searchcourses", searchcourses);
app.use("/announcement", getOrPostAnnouncement);
app.use("/enroll", enroll);
app.use("/waitlist", waitlist);
// ANCHOR
app.use("/dropcourse", dropcourse);
app.use("/profileimage", getOrPostProfileImage);
app.use("/permissionnumber", getOrPostPermissionnumber);
app.use("/allassignments", allassignments);
app.use("/assignment", getOrPostAssignment);
app.use("/allquizzes", allquizzes);
app.use("/quiz", getOrPostQuiz);
app.use("/takequiz", takequiz);
//app.use("/allgrades", allgrades);
app.use("/grade", grade);
app.use("/files", files);
app.use("/people", people);
app.use("/messages", getOrPostMessages);

//start your server on port 3001
app.listen(process.env.PORT || 3001);
console.log("Server Listening on port 3001");
