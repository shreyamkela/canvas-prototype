import React, { Component } from "react";
import cookie from "react-cookies";
import { connect } from "react-redux"; // Connects the components to the redux store
import { Route } from "react-router-dom";
import { Redirect } from "react-router";

//import './App.css';
import Login from "../LoginPage/Login";

import Main from "../Main/Main";

class App extends Component {
  render() {
    const { loginRequest } = this.props;
    //if not logged in go to login page:
    // At the server end, we use res.cookie command of the express-session library, to set the name 'cookie' to the cookie sent to client, when admin logs in. At react/client end, we can check whether the name is 'cookie' or not, to authenticate.
    // At react/client end, we check the cookie name using cookie.load('cookie') command of the 'react-cookies' library. If cookie.load('cookie') != null this means that the user is admin
    // https://stackoverflow.com/questions/44107665/how-to-access-a-browser-cookie-in-a-react-app
    if (cookie.load("cookie") || loginRequest.persona == "1" || loginRequest.persona == "2") {
      return (
        <React.Fragment>
          <Route path="/" component={Main} />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Route path="/" component={Login} />
        </React.Fragment>
      );
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
