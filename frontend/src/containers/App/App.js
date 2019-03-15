import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux"; // Connects the components to the redux store

//import './App.css';
import Main from "../Main/Main";

class App extends Component {
  render() {
    //const { loginRequest } = this.props; // redux state to props
    console.log("Cookie", cookie.load("cookie"));
    if (!cookie.load("cookie")) {
      console.log("Redirecting to Login...");
      return <Redirect to="/signin" />;
    } else {
      return <Main />;
    }
  }
}

// NOTE Why are we connecting the App.js to the store and mapping state to props when we are not using any state/redux in this file?
// Answer: When we login and server sends the cookie the cookie is saved in redux store as the axios.post postLogiData is a dispatch action and its response is taken as payload inside of redux (see user.actions.js postLoginData method).
// Now as the reponse received from server is inside redux store, we need to connect app.js to the redux store so that App.js can access the cookies when we do cookie.load('cookie').
// When login is clicked, index.js of frontend will route the webpage to the App component that is, this component, but as App is not able to find the already set cookie (which is in redux store) therefore App.js redirects back to login.
// And therefore, we need to connect App.js as well to the redux store and mapStateToProps (mapStateToProps brings loginRequest reducer payload into App.js as the state, and we are able to access the cookie with cookie.load)

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(App);
