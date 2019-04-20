import axios from "axios";
import cookie from "react-cookies";
import API from "../_helpers/API";

import {
  REGISTER,
  EDIT,
  LOGIN_REQUEST,
  CREATE_COURSE,
  COURSE_DATA_TO_COMPONENT,
  CURRENT_COURSE_DATA_TO_COMPONENT,
  ANNOUNCEMENT_CREATE,
  LOGOUT_REQUEST
} from "./types";

export const postRegistrationData = data => dispatch => {
  console.log("postRegistrationData called!");
  dispatch({
    type: REGISTER, // Sending type in action dispatches is mandatory
    payload: data
  });
};

export const postEditData = data => dispatch => {
  console.log("postEditData called!");
  dispatch({
    type: EDIT, // Sending type in action dispatches is mandatory
    payload: data
  });
};

export const postLoginData = data => dispatch => {
  console.log("postLoginData called!");
  //set the with credentials to true - NOTE withCredentials has to be true if we want to send and receive cookies between express and react
  axios.defaults.withCredentials = true;

  API.post("login", {
    // data is accessible at the backend by req.body.query
    data
  })
    .then(response => {
      console.log("XXXXXXXXXXXXXXXXXXXXXXXXX", response);
      // FIXME when we open login page, we can only login after 8-10 seconds of application being left idle on the login page, even when all credentials are correct. Why is this happening? Why can't we login as soon as the application login loads?
      dispatch({
        type: LOGIN_REQUEST, // Sending type in action dispatches is mandatory
        payload: response,
        email: data.email
      });
    })
    .catch(error => {
      dispatch({
        type: LOGIN_REQUEST, // Sending type in action dispatches is mandatory
        payload: error.response
      });
    });

  console.log("Actions cookie", cookie.load("cookie"));
};

export const postCreationData = data => dispatch => {
  console.log("postCreationData called!");
  //set the with credentials to true - NOTE withCredentials has to be true if we want to send and receive cookies between express and react
  axios.defaults.withCredentials = true;
  API.post("createcourse", {
    // data is accessible at the backend by req.body.query
    data
  }).then(response =>
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
  API.post("announcement", {
    // data is accessible at the backend by req.body.query
    data
  }).then(response =>
    dispatch({
      type: ANNOUNCEMENT_CREATE, // Sending type in action dispatches is mandatory
      payload: response.data
    })
  );
};

export const logOut = () => dispatch => {
  console.log("logOut action called!");
  dispatch({
    type: LOGOUT_REQUEST // Sending type in action dispatches is mandatory
  });
};
