//Route to handle Get Request Call to load all details of profile
const express = require("express");
const router = express.Router();
const db = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get Profile Data Called!");
  let profileData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
  db.query(`SELECT * FROM profile WHERE Email = '${profileData.email}'`, (err, results) => {
    if (err) throw err;
    if (results[0] !== undefined) {
      console.log("Profile data for this Email:", results[0]);
      res.status(200).send(results[0]);
    } else {
      res.status(400).send();
    }
  });
});

router.post("/", function(req, res) {
  console.log("Edit Profile Data Posted!");
  let profileData = req.body.data;
  console.log(profileData);

  db.query(
    `UPDATE profile SET AboutMe = '${profileData.AboutMe}', Gender='${profileData.Gender}', ContactNo='${profileData.ContactNo}', City='${
      profileData.City
    }', Country='${profileData.Country}', Company='${profileData.Company}', School='${profileData.School}', Hometown='${
      profileData.Hometown
    }', Languages= '${profileData.Languages}' WHERE Email = '${profileData.email}'`,
    err => {
      if (err) throw err;
      console.log("New details added to Profile table");
      res.send("Edit Successful!");
    }
  );
});

module.exports = router;
