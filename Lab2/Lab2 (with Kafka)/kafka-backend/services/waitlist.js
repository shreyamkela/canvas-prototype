const Model = require("../database/connection");

function handle_request(message, callback) {
  console.log("Waitlisting into a course!");
  let waitlistData = message.data;
  console.log("Waitlist data: ", waitlistData);
  let alreadyWaitlisted = false;
  if (waitlistData.courseId != undefined) {
    // First we check if waitlistData.courseId is undefined
    // Then we check whether this course is already waitlisted
    // Then we check whether this course is already enrolled
    // Then we insert

    Model.userDetails.findOne(
      {
        email: waitlistData.email
      },
      (err, result) => {
        if (err) {
          console.log("Unable to fetch user", err);
        } else {
          if (result) {
            console.log("Course already waitlisted for this email!");
            alreadyWaitlisted = true;
            callback("Course already waitlisted!", null);
          } else {
            result.waitlistedCourses.push(waitlistData.course);
            result.save().then(
              doc => {
                console.log("New details added to this user details", doc);
                callback("Addition Successful!", null);
              },
              err => {
                console.log("Unable to save course details.", err);
                callback(err, null);
              }
            );
          }
        }
      }
    );
  }
}

exports.handle_request = handle_request;
