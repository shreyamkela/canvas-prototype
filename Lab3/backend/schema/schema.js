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

const Course = new GraphQLObjectType({
  name: "Course",
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

const LoginResponse = new GraphQLObjectType({
  name: "LoginResponse",
  fields: () => ({
    result: { type: GraphQLBoolean }, // Logged in or not
    userData: { type: UserDetailsType }
  })
});

const SearchResult = new GraphQLObjectType({
  name: "SearchResult",
  fields: () => ({
    courses: { type: new GraphQLList(Course) }
  })
});

const CreateCourseResult = new GraphQLObjectType({
  name: "CreateCourseResult",
  fields: () => ({
    success: { type: GraphQLBoolean }
  })
});

const tripDetails = new GraphQLObjectType({
  name: "tripDetailResult",
  fields: () => ({
    PropertyId: { type: GraphQLString },
    Bookingstartdate: { type: GraphQLString },
    Bookingenddate: { type: GraphQLString },
    TotalCost: { type: GraphQLString },
    Ownername: { type: GraphQLString },
    Travelername: { type: GraphQLString },
    Headline: { type: GraphQLString },
    PropertyType: { type: GraphQLString },
    PropertyBedrooms: { type: GraphQLInt },
    PropertyBathrooms: { type: GraphQLInt },
    PropertyAccomodates: { type: GraphQLInt }
  })
});

const tripDetailsResult = new GraphQLObjectType({
  name: "tripDetailsResult",
  fields: () => ({
    trips: { type: new GraphQLList(tripDetails) }
  })
});

const postedProperty = new GraphQLObjectType({
  name: "postedProperty",
  fields: () => ({
    PropertyId: { type: GraphQLString },
    AvailabilityStartDate: { type: GraphQLString },
    AvailabilityEndDate: { type: GraphQLString },
    Baserate: { type: GraphQLString },
    Headline: { type: GraphQLString },
    PropertyType: { type: GraphQLString }
  })
});

const postedPropertyDetails = new GraphQLObjectType({
  name: "postedPropertyDetails",
  fields: () => ({
    postedProperties: { type: new GraphQLList(postedProperty) }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    login: {
      type: LoginResponse,
      args: {
        Username: {
          type: GraphQLString
        },
        Password: {
          type: GraphQLString
        }
      },
      async resolve(parent, args) {
        console.log("args: ", args);
        var isAuthenticated = false;
        var profileData = {};

        await Model.Userdetails.findOne(
          {
            Username: args.Username
          },
          (err, user) => {
            if (err) {
              isAuthenticated = false;
            } else {
              console.log("result", user.Username);
              if (!bcrypt.compareSync(args.Password, user.Password)) {
                console.log("Invalid Credentials!");
                //callback(null, null);
                isAuthenticated = false;
              } else {
                console.log("Corect creds!");
                isAuthenticated = true;

                profileData = user;
              }
            }
          }
        );

        console.log("isauth", isAuthenticated);
        console.log("Profile Data", profileData);
        if (isAuthenticated == true) {
          var result = {
            result: true,
            userData: profileData
          };
          console.log("UserData", result.userData);
        } else {
          var result = {
            result: false
          };
        }
        return result;
      }
    },
    profile: {
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
    search: {
      type: SearchResult,
      args: {
        searchText: { type: GraphQLString },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString }
      },
      async resolve(parent, args) {
        console.log(args);

        var propertyData = [];
        await Model.PropertyDetails.find(
          {
            City: args.searchText
          },
          (err, result) => {
            if (err) {
            } else {
              console.log("props list ", result);
              propertyData = result.concat();
              console.log("propserties", propertyData);
            }
          }
        );

        var resultData = {
          properties: propertyData
        };

        return resultData;
      }
    },
    property: {
      type: Property,
      args: {
        propertyId: { type: GraphQLString }
      },
      async resolve(parent, args) {
        console.log(args);
        var propertyResult = {};
        await Model.PropertyDetails.find(
          {
            PropertyId: args.propertyId
          },
          (err, result) => {
            if (err) {
            } else {
              console.log("Result ", result);
              propertyResult = result[0];
            }
          }
        );
        return propertyResult;
      }
    },
    tripDetails: {
      type: tripDetailsResult,
      args: {
        Email: { type: GraphQLString }
      },
      async resolve(parent, args) {
        console.log(args);
        var tripDetails = [];
        await Model.Userdetails.findOne(
          {
            Email: args.Email
          },
          (err, result) => {
            if (err) {
            } else {
              console.log("result", result.Tripdetails);
              tripDetails = result.Tripdetails.concat();
            }
          }
        );

        var tripsResult = {
          trips: tripDetails
        };

        return tripsResult;
      }
    },
    postedProperties: {
      type: postedPropertyDetails,
      args: {
        Email: { type: GraphQLString }
      },
      async resolve(parent, args) {
        console.log(args);
        var postedProperties = [];
        await Model.Userdetails.findOne(
          {
            Email: args.Email
          },
          (err, result) => {
            if (err) {
            } else {
              console.log("result", result.PropertyDetails);
              postedProperties = result.PropertyDetails.concat();
            }
          }
        );
        var postedPropertyDetails = {
          postedProperties: postedProperties
        };
        return postedPropertyDetails;
      }
    }
  })
});

const updateProfileResult = new GraphQLObjectType({
  name: "updateProfileResult",
  fields: () => ({
    success: { type: GraphQLBoolean }
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
    bookProperty: {
      type: createCourseResult,
      args: {
        PropertyId: { type: GraphQLString },
        Ownername: { type: GraphQLString },
        Headline: { type: GraphQLString },
        PropertyType: { type: GraphQLString },
        PropertyBedrooms: { type: GraphQLInt },
        PropertyBathrooms: { type: GraphQLInt },
        PropertyAccomodates: { type: GraphQLInt },
        PropertyBookingStartDate: { type: GraphQLString },
        PropertyBookingEndDate: { type: GraphQLString },
        PropertyTotalCost: { type: GraphQLString },
        Email: { type: GraphQLString },
        FirstName: { type: GraphQLString }
      },
      resolve: (parent, args) => {
        console.log(args);
        //var success = true;
        Model.Userdetails.findOne(
          {
            Email: args.Email
          },
          function(err, user) {
            if (err) {
              console.log("Unable to get user details.", err);
              //callback(err, null);
            } else {
              var propertyDetails = {};
              propertyDetails.PropertyId = args.PropertyId;
              propertyDetails.Bookingstartdate = args.PropertyBookingStartDate;
              propertyDetails.Bookingenddate = args.PropertyBookingEndDate;
              //propertyDetails.Guests = message.body.Guests;
              propertyDetails.TotalCost = args.PropertyTotalCost;
              propertyDetails.Ownername = args.Ownername;
              propertyDetails.Travelername = args.FirstName;
              //propertyDetails.TravelerId = userSession.ProfileId;
              propertyDetails.Headline = args.Headline;
              propertyDetails.PropertyType = args.PropertyType;
              propertyDetails.PropertyBedrooms = args.PropertyBedrooms;
              propertyDetails.PropertyBathrooms = args.PropertyBathrooms;
              propertyDetails.PropertyAccomodates = args.PropertyAccomodates;

              user.Tripdetails = user.Tripdetails || [];
              user.Tripdetails.push(propertyDetails);
              user.save().then(
                doc => {
                  console.log("Booking details saved to user details", doc);
                  //callback(null, doc);
                },
                err => {
                  console.log("Unable to save booking details.", err);
                  //callback(err, null);
                }
              );
            }
          }
        );

        var bookingResult = {
          success: true
        };

        return bookingResult;
      }
    },
    updateProfile: {
      type: updateProfileResult,
      args: {
        FirstName: { type: GraphQLString },
        LastName: { type: GraphQLString },
        Email: { type: GraphQLString },
        PhoneNumber: { type: GraphQLString },
        Aboutme: { type: GraphQLString },
        Country: { type: GraphQLString },
        City: { type: GraphQLString },
        Gender: { type: GraphQLString },
        School: { type: GraphQLString },
        Hometown: { type: GraphQLString },
        Language: { type: GraphQLString },
        Company: { type: GraphQLString }
      },
      async resolve(parent, args) {
        console.log(args);
        await Model.Userdetails.findOne(
          {
            Email: args.Email
          },
          (err, user) => {
            if (err) {
              console.log("Unable to fetch user details.", err);
              callback(err, null);
            } else {
              console.log("Userdetails", user);

              user.FirstName = args.FirstName;
              user.LastName = args.LastName;
              user.Email = args.Email;
              user.Aboutme = args.Aboutme;
              user.Country = args.Country;
              user.City = args.City;
              user.Gender = args.Gender;
              user.Hometown = args.Hometown;
              user.School = args.School;
              user.Company = args.Company;
              user.Language = args.Language;
              user.PhoneNumber = args.PhoneNumber;

              user.save().then(
                doc => {
                  console.log("User details saved successfully.", doc);
                  //callback(null, doc);
                },
                err => {
                  console.log("Unable to save user details.", err);
                  callback(err, null);
                }
              );
            }
          }
        );

        var resultData = {
          success: true
        };

        return resultData;
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
