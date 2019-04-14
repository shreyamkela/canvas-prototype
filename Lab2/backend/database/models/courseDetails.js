module.exports = courseDetails = mongoose.model("courseDetails", {
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
