const Model = require("../database/connection");

function handle_request(message, callback) {
  console.log("Get Quiz Data Called!");
  // ANCHOR
  let quizData = message; // In GET request, req.query is used to access the data sent from frontend in params

  Model.courseDetails.findOne(
    {
      courseId: quizData.courseId
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch cours", err);
        callback(err, null);
      } else {
        if (result) {
          console.log("Quizzes detail: ", result);
          callback(null, result);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

function handle_request(message, callback) {
  console.log("Create/Submit Quiz Data Posted!");
  // ANCHOR
  let quizData = message.data;
  if (quizData.persona == 2) {
    Model.courseDetails.findOne(
      {
        courseId: quizData.courseId
      },
      (err, result) => {
        if (err) {
          console.log("Unable to fetch course", err);
        } else {
          if (result) {
            result.quizzes[quizData.email].push(quizData);
            result.save().then(
              doc => {
                console.log("New details added to this users quizzes", doc);
                callback(null, result);
              },
              err => {
                console.log("Unable to save quiz details.", err);
                callback(err, null);
              }
            );
          } else {
            callback(err, null);
          }
        }
      }
    );
  } else if (quizData.persona == 1) {
    Model.courseDetails.findOne(
      {
        courseId: quizData.courseId
      },
      (err, result) => {
        if (err) {
          console.log("Unable to fetch course", err);
        } else {
          if (result) {
            result.quizzes.push(quizData);
            result.save().then(
              doc => {
                console.log("New details added to this course quizzs", doc);
                callback(null, result);
              },
              err => {
                console.log("Unable to save quiz details.", err);
                callback(err, null);
              }
            );
          } else {
            callback(err, null);
          }
        }
      }
    );
  }
}

exports.handle_request = handle_request;
