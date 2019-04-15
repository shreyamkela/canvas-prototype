var connection = require("./kafka/Connection");

var newuser = require("./services/newuser");
var login = require("./services/login");
var getOrPostProfile = require("./services/profile");
var createcourse = require("./services/createcourse");
var getcourses = require("./services/getcourses");
var searchcourses = require("./services/searchcourses");
var getOrPostAnnouncement = require("./services/announcement");
var enroll = require("./services/enroll");
var waitlist = require("./services/waitlist");
// ANCHOR
var dropcourse = require("./services/dropcourse");
var getOrPostProfileImage = require("./services/profileimage");
var getOrPostPermissionnumber = require("./services/permissionnumber");
var allassignments = require("./services/allassignments");
var getOrPostAssignment = require("./services/assignment");
var allquizzes = require("./services/allquizzes");
var getOrPostQuiz = require("./services/quiz");
var takequiz = require("./services/takequiz");
var allgrades = require("./services/allgrades");
var grade = require("./services/grade");
var files = require("./services/files");
var people = require("./services/people");
var getOrPostMessages = require("./services/messages");

function handleTopicRequest(topic_name, function_name) {
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();

  console.log("Kafka Server is running...");
  consumer.on("message", function(message) {
    console.log("Message recieved for: " + topic_name + " " + function_name);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    function_name.handle_request(data.data, function(err, res) {
      console.log("After request handling: ", res);
      var payload = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res
          }),
          partition: 0
        }
      ];

      producer.send(payload, function(err, data) {
        console.log("Data: ", data);
      });
      return;
    });
  });
}

handleTopicRequest("newuser", newuser);
handleTopicRequest("login", login);
handleTopicRequest("profile", getOrPostProfile);
handleTopicRequest("createcourse", createcourse);
handleTopicRequest("getcourses", getcourses);
handleTopicRequest("searchcourses", searchcourses);
handleTopicRequest("announcement", getOrPostAnnouncement);
handleTopicRequest("enroll", enroll);
handleTopicRequest("waitlist", waitlist);
// ANCHOR
handleTopicRequest("dropcourse", dropcourse);
handleTopicRequest("profileimage", getOrPostProfileImage);
handleTopicRequest("permissionnumber", getOrPostPermissionnumber);
handleTopicRequest("allassignments", allassignments);
handleTopicRequest("assignment", getOrPostAssignment);
handleTopicRequest("allquizzes", allquizzes);
handleTopicRequest("quiz", getOrPostQuiz);
handleTopicRequest("takequiz", takequiz);
handleTopicRequest("allgrades", allgrades);
handleTopicRequest("grade", grade);
handleTopicRequest("files", files);
handleTopicRequest("people", people);
handleTopicRequest("messages", getOrPostMessages);
