const graphql = require("graphql");
var Model = require("../database/connection");
var bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLDate } = graphql;

const UserDetailsType = new GraphQLObjectType({
  name: "UserDetailsType",
  fields: () => ({
    email: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    persona: {
      // Student or Faculty
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    aboutMe: {
      type: GraphQLString
    },
    gender: {
      type: GraphQLString
    },
    contactNumber: {
      type: GraphQLString
    },
    country: {
      type: GraphQLString
    },
    city: {
      type: GraphQLString
    },
    hometown: {
      type: GraphQLString
    },
    school: {
      type: GraphQLString
    },
    company: {
      type: GraphQLString
    },
    languages: {
      type: GraphQLList
    },
    createdCourses: {
      // If it is a Faculty
      type: GraphQLList
    },
    enrolledCourses: {
      // If it is a student
      type: GraphQLList
    },
    waitlistedCourses: {
      // If it is a student
      type: GraphQLList
    },
    permissionNumbers: {
      type: GraphQLList
    },
    grades: {
      // If it is a student
      type: GraphQLList
    }
  })
});

const CourseDetailsType = new GraphQLObjectType({
  name: "CourseDetailsType",
  fields: () => ({
    CourseId: { type: GraphQLString },
    CourseName: { type: GraphQLString },
    FacultyEmail: { type: GraphQLString },
    Description: { type: GraphQLString },
    Department: { type: GraphQLString },
    Room: { type: GraphQLString },
    Capacity: { type: GraphQLInt },
    Waitlist: { type: GraphQLInt },
    Term: { type: GraphQLString },
    CapacityUsed: { type: GraphQLInt },
    WaitlistUsed: { type: GraphQLInt },
    Announcements: { type: GraphQLList },
    Files: { type: GraphQLList },
    Assignments: { type: GraphQLList },
    Quizzes: { type: GraphQLList },
    EnrolledStudents: { type: GraphQLList },
    WaitlistedStudents: { type: GraphQLList }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    login: {
      // Login existing user
      type: UserDetailsType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const user = await Model.userDetails.findOne({
          email: args.email
        });
        if (user) {
          var hashpass = await bcrypt.compare(args.password, user.password);
          if (hashpass) {
            var token = await jwt.sign({ user: user }, jwtkey.secret, { expiresIn: "10080s" });
          }
          return { jwttoken: token };
        } else {
          return { message: "User does not exist in the database!" };
        }
      }
    },
    profile: {
      // Get user profile
      type: UserDetailsType,
      args: {
        Email: {
          type: GraphQLString
        }
      },
      async resolve(parent, args) {
        console.log("args: ", args);
        var profileData = {};
        await Model.Userdetails.findOne(
          {
            Email: args.Email
          },
          (err, user) => {
            if (err) {
            } else {
              console.log("User details: ", user);
              profileData = user;
            }
          }
        );

        return profileData;
      }
    },
    course: {
      // Search for a course
      type: CourseDetailsType,
      args: {
        searchValue: { type: GraphQLString },
        filterBy: { type: GraphQLString },
        searchBy: { type: GraphQLString }
      },
      async resolve(parent, args) {
        console.log(args);
        let searchValue = args.searchValue.toLowerCase(); // Selecting only those courses to send to frontend, that have been created by the logged in faculty. We make the search query lowercase and will compare with items that will also be made lowercase
        const filterBy = args.filterRadioValue;
        const searchBy = args.searchByRadioValue;
        let searchedCourses = [];
        let searchByQuery = null;

        switch (searchBy) {
          case "id":
            searchByQuery = "Id";
            break;
          case "term":
            searchByQuery = "Term";
            break;
          case "name":
            searchByQuery = "Name";
            break;
        }

        Model.courseDetails.find({}, (err, user) => {
          if (err) {
            console.log("Unable to fetch courses", err);
            return { message: "Unable to fetch courses!" };
          } else {
            if (user) {
              if (searchByQuery === "Id") {
                for (var key in user) {
                  let currentId = user[key].id.toLowerCase();
                  switch (filterBy) {
                    case "1":
                      if (currentId === searchValue) {
                        searchedCourses.push(user[key]);
                        console.log("searchedCourses", searchedCourses);
                      }
                      break;
                    case "2":
                      if (currentId > searchValue) {
                        searchedCourses.push(user[key]);
                        console.log("searchedCourses", searchedCourses);
                      }
                      break;
                    case "3":
                      if (currentId < searchValue) {
                        searchedCourses.push(user[key]);
                        console.log("searchedCourses", searchedCourses);
                      }
                      break;
                  }
                }
                if (searchedCourses == []) {
                  console.log("No courses available.");
                  return { message: "No Courses!" };
                } else {
                  return searchedCourses;
                }
              } else if (searchByQuery === "Term" || searchByQuery === "Name") {
                for (var key in user) {
                  if (searchByQuery === "Term") {
                    let currentTerm = user[key].term.toLowerCase();
                    if (currentTerm.includes(searchValue)) {
                      searchedCourses.push(user[key]);
                    }
                  } else {
                    let currentTerm = user[key].courseName.toLowerCase();
                    if (currentTerm.includes(searchValue)) {
                      searchedCourses.push(user[key]);
                    }
                  }
                }
                if (searchedCourses === []) {
                  console.log("No courses available.");
                  return { message: "No Courses!" };
                } else {
                  console.log("searchedCourses", searchedCourses);
                  return searchedCourses;
                }
              } else {
                console.log("No courses available.");
                return { message: "No Courses!" };
              }
            } else {
              console.log("Unable to fetch courses", err);
              return { message: "No courses found!" };
            }
          }
        });
      }
    },

    courseDetails: {
      // Get enrolled course or created course for a particular user depending on the persona of that user - To display course cards
      type: CourseDetailsType,
      args: {
        email: {
          type: GraphQLString
        }
      },
      async resolve(parent, args) {
        console.log("args: ", args);
        await Model.userDetails.findOne(
          {
            email: args.email
          },
          (err, user) => {
            if (err) {
              console.log("Unable to fetch user", err);
            } else {
              if (user) {
                console.log("Courses detail: ", user);

                if (args.persona === "1") {
                  Model.courseDetails.find({ courseId: { $in: user.createdCourses } }, (err, results) => {
                    if (err) {
                      console.log("Unable to fetch courses", err);
                      return { message: "Unable to fetch courses" };
                    } else {
                      if (results) {
                        console.log("Courses detail: ", results);
                        return results;
                      } else {
                        console.log("Unable to fetch courses");
                        return { message: "Unable to fetch courses" };
                      }
                    }
                  });
                } else if (args.persona === "2") {
                  Model.courseDetails.find({ courseId: { $in: user.enrolledCourses } }, (err, results) => {
                    if (err) {
                      console.log("Unable to fetch courses", err);
                      return { message: "Unable to fetch courses" };
                    } else {
                      if (results) {
                        console.log("Courses detail: ", results);
                        return results;
                      } else {
                        console.log("Unable to fetch courses");
                        return { message: "Unable to fetch courses" };
                      }
                    }
                  });
                }
              } else {
                console.log("No courses available.");
                return { message: "No courses" };
              }
            }
          }
        );
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    newUser: {
      type: UserDetailsType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        persona: { type: GraphQLInt }
      },

      async resolve(parent, args) {
        await Model.userDetails.findOne(
          {
            email: args.email
          },
          (err, user) => {
            if (err) {
            } else {
              if (user) {
                console.log("User already exists!", user);
                return { message: "User already exists!" };
              } else {
                // Hashing the password
                const hashedPassword = bcrypt.hashSync(args.password, saltRounds);
                var user = new Model.userDetails({
                  email: args.email,
                  password: hashedPassword,
                  persona: args.persona,
                  firstName: args.firstName,
                  lastName: args.lastName
                });

                user.save().then(
                  doc => {
                    console.log("User saved successfully.", doc);
                    return { message: "Registration Successful!" };
                  },
                  err => {
                    console.log("Unable to save user details.", err);
                  }
                );
              }
            }
          }
        );
      }
    },
    enrollCourse: {
      type: CourseDetailsType,
      args: {
        email: { type: GraphQLString },
        courseId: { type: GraphQLString }
      },
      async resolve(parent, args) {
        console.log(args);
        //var success = true;
        await Model.userDetails.findOne(
          {
            email: args.email
          },
          (err, user) => {
            if (err) {
              console.log("Unable to fetch user", err);
              return { message: "Unable to enroll course. Please try again." };
            } else {
              if (user) {
                if (user.enrolledCourses.includes(args.courseId)) {
                  // Checking if the course is already enrolled
                  console.log("Course already enrolled for this email!");
                  return { message: "Course already enrolled for this email!" };
                } else if (user.waitlistedCourses.includes(args.courseId)) {
                  // Checking if the course is already waitlisted
                  console.log("Course already waitlisted for this email!");
                  return { message: "Course already waitlisted!" };
                } else {
                  user.enrolledCourses.push(args.courseId);
                  user.save().then(
                    doc => {
                      console.log("New details added to this user details", doc);
                      Model.courseDetails.findOne(
                        {
                          courseId: args.courseId
                        },
                        (err, results) => {
                          if (err) {
                            console.log("Unable to fetch course", err);
                            return { message: "Unable to enroll course. Please try again." };
                          } else {
                            if (results) {
                              results.enrolledStudents.push(args.email);
                              results.capacityUsed++;
                              results.save().then(
                                doc_1 => {
                                  console.log("New details added to this course details", doc_1);
                                  return doc_1;
                                },
                                err => {
                                  console.log("Unable to enroll student in course. Please try again.", err);
                                  return { message: "Unable to enroll course. Please try again." };
                                }
                              );
                              res.send("Course enrolled!");
                            } else {
                              console.log("Unable to fetch course", err);
                              return { message: "Unable to enroll course. Please try again." };
                            }
                          }
                        }
                      );
                    },
                    err => {
                      console.log("Unable to enroll course. Please try again.", err);
                      return { message: "Unable to enroll course. Please try again." };
                    }
                  );
                }
              } else {
                return { message: "Unable to enroll course. Please try again." };
              }
            }
          }
        );
      }
    },
    createCourse: {
      type: CourseDetailsType,
      args: {
        id: { type: GraphQLString },
        courseName: { type: GraphQLString },
        facultyEmail: { type: GraphQLString },
        description: { type: GraphQLString },
        department: { type: GraphQLString },
        room: { type: GraphQLString },
        capacity: { type: GraphQLInt },
        waitlist: { type: GraphQLInt },
        term: { type: GraphQLString }
      },
      async resolve(parent, args) {
        console.log(args);
        //var success = true;
        await Model.courseDetails.findOne(
          {
            courseId: args.courseId
          },
          (err, user) => {
            if (err) {
              console.log("Unable to fetch courses", err);
            } else {
              if (user) {
                console.log("Course id already present!");
                res.send("Course id already present!");
              } else {
                // if not present
                var id = mongoose.Types.ObjectId();
                var user = new Model.courseDetails({
                  id: id,
                  courseId: args.courseId,
                  courseName: args.courseName,
                  facultyEmail: args.email,
                  department: args.dept,
                  description: args.descrip,
                  room: args.room,
                  capacity: args.classCap,
                  waitlist: args.waitlistCap,
                  term: args.term,
                  capacityUsed: 0,
                  waitlistUsed: 0,
                  announcements: [],
                  files: [],
                  assignments: [],
                  quizzes: [],
                  enrolledStudents: [],
                  waitlistedStudents: []
                });

                user.save().then(
                  doc => {
                    console.log("Course saved successfully.", doc);

                    Model.userDetails.updateOne(
                      {
                        email: args.email
                      },
                      { $push: { createdCourses: args.courseId } },
                      (err, result) => {
                        if (err) {
                          console.log("Unable to fetch faculty.", err);
                          return { message: "Unable to save course details." }; // status should come before send
                        } else {
                          if (result) {
                            return { message: "Creation Successful!" }; // status should come before send
                          } else {
                            console.log("Faculty not found!", err);
                            return { message: "Unable to save course details." }; // status should come before send
                          }
                        }
                      }
                    );
                  },
                  err => {
                    console.log("Unable to save course details.", err);
                    return { message: "Unable to save course details." }; // status should come before send
                  }
                );
              }
            }
          }
        );
      }
    },
    updateUser: {
      type: UserDetailsType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        aboutme: { type: GraphQLString },
        country: { type: GraphQLString },
        city: { type: GraphQLString },
        gender: { type: GraphQLString },
        school: { type: GraphQLString },
        hometown: { type: GraphQLString },
        language: { type: GraphQLString },
        company: { type: GraphQLString }
      },
      async resolve(parent, args) {
        console.log(args);
        await Model.userDetails.findOne(
          {
            email: args.email
          },
          (err, user) => {
            if (err) {
              console.log("Unable to fetch user details.", err);
              return { message: "Unable to fetch user details." };
            } else {
              console.log("User Details: ", user);

              user.firstName = args.firstName;
              user.lastName = args.lastName;
              user.email = args.email;
              user.aboutme = args.aboutme;
              user.country = args.country;
              user.city = args.city;
              user.gender = args.gender;
              user.hometown = args.hometown;
              user.school = args.school;
              user.company = args.company;
              user.language = args.language;
              user.phoneNumber = args.phoneNumber;

              user.save().then(
                doc => {
                  console.log("User details saved successfully.", doc);
                  return user;
                },
                err => {
                  console.log("Unable to save user details.", err);
                  return { message: "Unable to save user details." };
                }
              );
            }
          }
        );
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
