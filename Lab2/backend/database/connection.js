// Mongoose Setup - MongoDB - ORM

const mongoose = require("mongoose");
const options = {
  poolSize: 10,
  useNewUrlParser: true
};
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://shreyamkela:Shreyam123@ds139576.mlab.com:39576/canvas-shreyamkela", options);

var userDetails = mongoose.model("userDetails", {
  email: String,
  password: String,
  persona: String,
  firstName: String,
  lastName: String,
  aboutMe: String,
  gender: String,
  contactNumber: Number,
  city: String,
  country: String,
  company: String,
  school: String,
  hometown: String,
  languages: String,
  profileImage: String,
  createdCourses: Array,
  enrolledCourses: Array,
  waitlistedCourses: Array,
  permissionNumbers: Array,
  grades: Array,
  messages: Array
});

var courseDetails = mongoose.model("courseDetails", {
  courseId: String,
  courseName: String,
  facultyEmail: String,
  department: String,
  description: String,
  room: String,
  capacity: Number,
  waitlist: Number,
  term: String,
  capacityUsed: Number,
  waitlistUsed: Number,
  announcements: Array,
  files: Array,
  assignments: Array,
  quizzes: Array,
  enrolledStudents: Array,
  waitlistedStudents: Array
});

module.exports = {
  userDetails,
  courseDetails
};
