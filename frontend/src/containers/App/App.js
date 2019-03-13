import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux"; // Glues react and redux together

//import './App.css';
import Login from "../LoginPage/Login";
import Dashboard from "../HomePage/Dashboard";
import Profile from "../ProfilePage/Profile";
import Courses from "../Courses/Courses";
import Create from "../Courses/Create";

import store from "../../_helpers/store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        {/* Order of provider and browserrouter doesnt matter.
        Use Browser Router to route to different pages. */}
        <BrowserRouter>
          <div>
            {/** All valid routes must be declared here for routing to work */}
            {/* App Component Has a Child Component called Login*/}
            <Route path="/" component={Login} />
            <Route path="/home" component={Dashboard} />
            <Route path="/profile" component={Profile} />
            <Route path="/courses" component={Courses} />
            <Route path="/create" component={Create} /> {/* FIXME Make create route inside the courses file*/}
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
