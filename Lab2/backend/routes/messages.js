//Route to handle Get Request Call to show all messages, for a user
const express = require("express");
const router = express.Router();
const db = require("../database/mongoose");

router.get("/", function(req, res) {
  console.log("Get messages data called!");

  // ANCHOR
  let messageData = req.query; // In GET request, req.query is used to access the data sent from frontend in params
});

//Route to handle Post Request Call to post a message, by a user
router.post("/", function(req, res) {
  console.log("Send a message data posted!");
  // ANCHOR
  let messageData = req.body.data;
});

module.exports = router;
