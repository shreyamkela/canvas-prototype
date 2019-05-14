// import { gql } from 'apollo-boost';
import gql from "graphql-tag";

// Login an existing user
const getLoginQuery = gql`
  query login($email: String, $password: String) {
    user(email: $email, password: $password) {
      error
      jwttoken
    }
  }
`;

// Search courses according to search term/value and the filter/criteria
const getSearchQuery = gql`
  query course($searchValue: String, $filterBy: String, $searchBy: String) {
    course(searchValue: $searchValue, filterBy: $filterBy, searchBy: $searchBy) {
      id
      courseName
      facultyEmail
      department
      description
      room
      capacity
      waitlist
      term
    }
  }
`;

// Show profile
const getProfileQuery = gql`
  query profile($email: String) {
    profile(email: $email) {
      firstName
      lastName
      phoneNumber
      aboutme
      country
      city
      gender
      school
      hometown
      language
      company
    }
  }
`;

// To show the course cards
const getCourseDetailsQuery = gql`
  query courseDetails($email: String) {
    courseDetails(email: $email) {
      id
      courseName
      facultyEmail
      description
      announcements
      files
      assignments
      quizzes
      enrolledStudents
      waitlistedStudents
    }
  }
`;

export { getLoginQuery, getSearchQuery, getCourseDetailsQuery, getProfileQuery };
