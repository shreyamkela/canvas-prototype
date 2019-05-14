import { gql } from "apollo-boost";

const newUserMutation = gql`
  mutation newUser($firstName: String, $lastName: String, $email: String, $password: String, $persona: String) {
    addUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, persona: $persona) {
      firstName
      email
    }
  }
`;

const enrollCourse = gql`
  mutation enrollCourse($email: String, $id: String) {
    enrollCourse(email: $email, id: $id) {
      email
      id
    }
  }
`;

const createCourse = gql`
  mutation createCourse(
    $id: String
    $courseName: String
    $facultyEmail: String
    $description: String
    $department: String
    $room: String
    $capacity: Number
    $waitlist: Number
    $term: String
  ) {
    enrollCourse(
      id: $id
      courseName: $courseName
      facultyEmail: $facultyEmail
      description: $description
      department: $department
      room: $room
      capacity: $capacity
      waitlist: $waitlist
      term: $term
    ) {
      facultyEmail
      id
    }
  }
`;

const updateUser = gql`
  mutation updateUser(
    $email: String
    $aboutMe: String
    $city: String
    $country: String
    $school: String
    $hometown: String
    $languages: String
    $gender: String
    $company: String
  ) {
    updateUser(
      email: $email
      aboutMe: $aboutMe
      city: $city
      country: $country
      school: $school
      hometown: $hometown
      languages: $languages
      gender: $gender
      company: $company
    ) {
      email
      aboutMe
    }
  }
`;

export { newUserMutation, enrollCourse, createCourse, updateUser };
