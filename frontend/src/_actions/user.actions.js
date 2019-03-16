import axios from "axios";
import cookie from "react-cookies";

import { LOGIN_REQUEST, REGISTER, CREATE_COURSE, COURSE_DATA_TO_COMPONENT, CURRENT_COURSE_DATA_TO_COMPONENT, ANNOUNCEMENT_CREATE } from "./types";

export const postLoginData = data => dispatch => {
  console.log("postLoginData called!");
  //set the with credentials to true - NOTE withCredentials has to be true if we want to send and receive cookies between express and react
  axios.defaults.withCredentials = true;
  axios
    .post("http://localhost:3001/login", {
      // data is accessible at the backend by req.body.query
      data
    })
    .then(response =>
      dispatch({
        type: LOGIN_REQUEST, // Sending type in action dispatches is mandatory
        payload: response,
        email: data.email
      })
    );

  console.log("Actions cookie", cookie.load("cookie"));
};

export const postRegistrationData = data => dispatch => {
  console.log("postRegistrationData called!");
  //set the with credentials to true - NOTE withCredentials has to be true if we want to send and receive cookies between express and react
  axios.defaults.withCredentials = true;
  axios
    .post("http://localhost:3001/newuser", {
      // data is accessible at the backend by req.body.query
      data
    })
    .then(response =>
      dispatch({
        type: REGISTER, // Sending type in action dispatches is mandatory
        payload: response.data
      })
    );
};

export const postCreationData = data => dispatch => {
  console.log("postCreationData called!");
  //set the with credentials to true - NOTE withCredentials has to be true if we want to send and receive cookies between express and react
  axios.defaults.withCredentials = true;
  axios
    .post("http://localhost:3001/createcourse", {
      // data is accessible at the backend by req.body.query
      data
    })
    .then(response =>
      dispatch({
        type: CREATE_COURSE, // Sending type in action dispatches is mandatory
        payload: response.data
      })
    );
};

export const courseDataToComponent = data => dispatch => {
  // Data of all the courses
  console.log("courseDataToComponent called!");
  dispatch({
    type: COURSE_DATA_TO_COMPONENT, // Sending type in action dispatches is mandatory
    payload: data
  });
};

export const currentCourseDataToComponent = data => dispatch => {
  // Data of current course
  console.log("courseDataToComponent called!");
  dispatch({
    type: CURRENT_COURSE_DATA_TO_COMPONENT, // Sending type in action dispatches is mandatory
    payload: data
  });
};

export const postAnnouncementData = data => dispatch => {
  console.log("postAnnouncementData called!");
  //set the with credentials to true - NOTE withCredentials has to be true if we want to send and receive cookies between express and react
  axios.defaults.withCredentials = true;
  axios
    .post("http://localhost:3001/announcement", {
      // data is accessible at the backend by req.body.query
      data
    })
    .then(response =>
      dispatch({
        type: ANNOUNCEMENT_CREATE, // Sending type in action dispatches is mandatory
        payload: response.data
      })
    );
};
