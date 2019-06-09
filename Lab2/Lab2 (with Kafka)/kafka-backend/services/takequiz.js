const Model = require("../database/connection");

function handle_request(message, callback) {
  console.log("Take a Quiz get data called!");

  // ANCHOR
  let quizData = message; // In GET request, req.query is used to access the data sent from frontend in params
  Model.courseDetails.findOne(
    {
      courseId: quizData.courseId
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch course", err);
        callback(err, null);
      } else {
        if (result) {
          console.log("Quiz details: ", result.quizzes[quizData.name]);
          callback(null, result);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

exports.handle_request = handle_request;
