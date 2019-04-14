var assert = require("chai").assert;
var app = require("../index");
var chai = require("chai");
var expect = require("chai").expect;

chai.use(require("chai-http"));
var agent = require("chai").request.agent(app);

describe("Student", function() {
  describe("POST /register", function() {
    it("should register new user successfully", function() {
      this.timeout(50000);
      agent
        .post("/newuser")
        .send({
          email: "shreyam@sjsu.edu",
          password: "admin"
        })
        .then(function(res) {
          assert.equal(res.status, 200);
        });
    });
  });

  // it("POST /register", function() {
  //   agent
  //     .post("/newuser")
  //     .send({
  //       email: "shreyam@sjsu.edu",
  //       password: "admin"
  //     })
  //     .then(function(res) {
  //       assert.equal(res.status, 400);
  //     });
  // });

  // it("POST /signin", function() {
  //   agent
  //     .post("/login")
  //     .send({
  //       email: "shreyam@sjsu.edu",
  //       password: "admin"
  //     })
  //     .then(function(res) {
  //       expect(res).to.have.status(200);
  //     });
  // });

  // it("GET /courses", function() {
  //   agent
  //     .post("/courses")
  //     .send({
  //       email: "shreyam@sjsu.edu",
  //       courseId: "CMPE273"
  //     })
  //     .then(function(res) {
  //       expect(res).to.have.status(200);
  //     });
  // });

  // it("POST /enroll", function() {
  //   agent
  //     .get("/enroll")
  //     .send({
  //       email: "shreyam@sjsu.edu",
  //       courseId: "CMPE275"
  //     })
  //     .then(function(res) {
  //       expect(res).to.have.status(200);
  //     });
  // });

  // it("POST /register", function() {
  //   agent
  //     .post("/newuser")
  //     .send({
  //       email: "shreyam@sjsu.edu",
  //       password: "admin"
  //     })
  //     .then(function(res) {
  //       assert.equal(res.status, 400);
  //     });
  // });

  // it("POST /signin", function() {
  //   agent
  //     .post("/login")
  //     .send({
  //       email: "shreyam@sjsu.edu",
  //       password: "admin"
  //     })
  //     .then(function(res) {
  //       expect(res).to.have.status(200);
  //     });
  // });

  // it("GET /courses", function() {
  //   agent
  //     .post("/courses")
  //     .send({
  //       email: "shreyam@sjsu.edu",
  //       courseId: "CMPE273"
  //     })
  //     .then(function(res) {
  //       expect(res).to.have.status(200);
  //     });
  // });

  // it("POST /enroll", function() {
  //   agent
  //     .get("/enroll")
  //     .send({
  //       email: "shreyam@sjsu.edu",
  //       courseId: "CMPE275"
  //     })
  //     .then(function(res) {
  //       expect(res).to.have.status(200);
  //     });
  // });
});
