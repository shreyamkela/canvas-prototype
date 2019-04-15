//Route to handle Get Request Call to show all messages, for a user
const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", function(req, res) {
  console.log("Get messages data called!");

  kafka.make_request("messages", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user", err);
    } else {
      if (result) {
        console.log("Messages detail: ", result);
        res.status(200).send(result.messages);
      } else {
        res.status(400).send();
      }
    }
  });
});

//Route to handle Post Request Call to post a message, by a user
router.post("/", function(req, res) {
  console.log("Send a message data posted!");
  // ANCHOR

  kafka.make_request("messages", req, function(err, result) {
    if (err) {
      console.log("Unable to fetch user", err);
    } else {
      if (result) {
        res.status(200).send();
      } else {
        res.status(400).send();
      }
    }
  });
});

module.exports = router;
