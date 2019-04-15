const Model = require("../database/connection");

function handle_request(message, callback) {
  console.log("Get Profile Data Called!");
  let profileData = message; // In GET request, req.query is used to access the data sent from frontend in params

  Model.userDetails.findOne(
    {
      email: profileData.email
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch user", err);
        callback(err, null);
      } else {
        if (result) {
          console.log("User details: ", result);
          callback(null, result);
        } else {
          callback(err, null);
        }
      }
    }
  );
}

function handle_request(message, callback) {
  console.log("Edit Profile Data Posted!");
  let profileData = message.data;
  console.log(profileData);

  Model.userDetails.findOne(
    {
      email: profileData.email
    },
    (err, result) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (result) {
          result.aboutMe.push(profileData.profile.aboutMe);
          result.gender.push(profileData.profile.gender);
          result.contactNumber.push(profileData.profile.contactNumber);
          result.city.push(profileData.profile.city);
          result.country.push(profileData.profile.country);
          result.company.push(profileData.profile.company);
          result.school.push(profileData.profile.school);
          result.hometown.push(profileData.profile.hometown);
          result.languages.push(profileData.profile.languages);
          result.save().then(
            doc => {
              console.log("New details added to this user profile", doc);
              callback("Addition Successful!", result);
            },
            err => {
              console.log("Unable to save profile details.", err);
              callback("Unable to save profile details.", null);
            }
          );
        } else {
          callback(err, null);
        }
      }
    }
  );
}

exports.handle_request = handle_request;
