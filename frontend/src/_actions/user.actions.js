import axios from "axios";
import cookie from "react-cookies";

import { LOGIN_REQUEST, REGISTER, SHOW_PROFILE } from "./types";

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
        payload: response
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

export const showProfile = data => dispatch => {
  console.log("showProfile called!", data);
  dispatch({
    type: SHOW_PROFILE, // Sending type in action dispatches is mandatory
    payload: data
  });
};
