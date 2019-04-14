//Route to handle Get Request Call to load all details of profile
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get Profile Data Called!");
  let profileData = req.query; // In GET request, req.query is used to access the data sent from frontend in params

  Model.userDetails.findOne(
    {
      email: profileData.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          console.log("User details: ", user);
          res.status(200).send(user);
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

router.post("/", function(req, res) {
  console.log("Edit Profile Data Posted!");
  let profileData = req.body.data;
  console.log(profileData);

  Model.userDetails.findOne(
    {
      email: profileData.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          user.aboutMe.push(profileData.profile.aboutMe);
          user.gender.push(profileData.profile.gender);
          user.contactNumber.push(profileData.profile.contactNumber);
          user.city.push(profileData.profile.city);
          user.country.push(profileData.profile.country);
          user.company.push(profileData.profile.company);
          user.school.push(profileData.profile.school);
          user.hometown.push(profileData.profile.hometown);
          user.languages.push(profileData.profile.languages);
          user.save().then(
            doc => {
              console.log("New details added to this user profile", doc);
              res.send("Addition Successful!");
            },
            err => {
              console.log("Unable to save profile details.", err);
              res.status(400).send();
            }
          );
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

module.exports = router;
