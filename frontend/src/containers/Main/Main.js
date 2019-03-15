import React, { Component } from "react";
import { Route } from "react-router-dom";
import cookie from "react-cookies";
import { Redirect } from "react-router";

//import './App.css';
import Dashboard from "../HomePage/Dashboard";
import Profile from "../ProfilePage/Profile";
import Courses from "../Courses/Courses";
import Create from "../Courses/Create"; // Create a course
import SideBar from "../Sidebar/SideBar";

import { Layout } from "antd";

class Main extends Component {
  render() {
    const { Header, Content, Footer, Sider } = Layout;
    console.log("Cookie", cookie.load("cookie"));
    if (!cookie.load("cookie")) {
      console.log("Redirecting to Login...");
      return <Redirect to="/signin" />;
    } else {
      return (
        <React.Fragment>
          <Layout>
            <SideBar />
            {/** All valid routes must be declared here for routing to work */}
            {/* App Component Has a Child Component called Login*/}
            <Content>
              {/* Layout inside layout would make the internal layout towards the right of parent layout i.e horizontally. All the components inside a layout would be displayed vertically from top to bottom */}
              <Layout>
                <Route exact path="/home" component={Dashboard} />
                <Route path="/profile" component={Profile} />
                <Route path="/courses/:id" component={Courses} />
                {/* FIXME Make create route inside the courses file*/}
                <Route path="/create" component={Create} /> {/* FIXME Make create route inside the courses file*/}
              </Layout>
            </Content>
          </Layout>
        </React.Fragment>
      );
    }
  }
}

export default Main;
