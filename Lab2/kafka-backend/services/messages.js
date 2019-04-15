//Route to handle Get Request Call to show all messages, for a user
const express = require("express");
const router = express.Router();
const Model = require("../database/connection");

router.get("/", function(req, res) {
  console.log("Get messages data called!");

  Model.messageDetails.findOne(
    {
      senderId: req.query.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          console.log("Messages detail: ", user);
          res.status(200).send(user.messages);
        } else {
          res.status(400).send();
        }
      }
    }
  );
});

//Route to handle Post Request Call to post a message, by a user
router.post("/", function(req, res) {
  console.log("Send a message data posted!");
  // ANCHOR
  let messageData = req.body.data;

  Model.messageDetails.findOne(
    {
      senderId: messageData.email
    },
    (err, user) => {
      if (err) {
        console.log("Unable to fetch user", err);
      } else {
        if (user) {
          user.message.push(messageData.message);
          user.save().then(
            doc => {
              console.log("New details added to this user messages", doc);
              res.send("Addition Successful!");
            },
            err => {
              console.log("Unable to save message details.", err);
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
