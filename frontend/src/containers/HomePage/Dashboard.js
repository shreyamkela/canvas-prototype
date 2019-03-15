// Home page is the dashboard page

import React, { Component } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import cookie from "react-cookies";
import { connect } from "react-redux"; // Connects the components to the redux store

import { Layout, Row, Col } from "antd";

import SideBar from "../Sidebar/SideBar";
import CourseCard from "./CourseCard";
import { CourseDataToSidebar } from "../../_actions/user.actions";

class Dashboard extends Component {
  state = { courses: "" };

  constructor() {
    super();
    axios
      .get("http://localhost:3001/getcourses")
      .then(response => {
        // you can access your data here
        //console.log("courses response:", response.data);
        this.setState({ courses: response.data });
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  handleLogOut = () => {
    // FIXME Handle logout with state? So that we dont have to include handleLogOut() into each and every page code
    console.log("Log Out Clicked!");
  };

  render() {
    let coursesPresent = null;
    let allCourses = null;
    //console.log("Home Page Reached!");
    //if not logged in go to login page:
    // At the server end, we use res.cookie command of the express-session library, to set the name 'cookie' to the cookie sent to client, when admin logs in. At react/client end, we can check whether the name is 'cookie' or not, to authenticate.
    // At react/client end, we check the cookie name using cookie.load('cookie') command of the 'react-cookies' library. If cookie.load('cookie') != null this means that the user is admin
    // https://stackoverflow.com/questions/44107665/how-to-access-a-browser-cookie-in-a-react-app
    //console.log("COURSES:", this.state.courses);
    if (this.state.courses === "noCourses") {
      allCourses = "noCourses";
      coursesPresent = (
        <font className="font-weight-bold" size="3">
          No courses available{/**If no courses present */}
        </font>
      );
    } else {
      let { dispatch } = this.props;

      dispatch(CourseDataToSidebar(this.state.courses)); // NOTE Posting course data to sidebar so that the courses drawer can show the courses. Also, here the sidebar is a child of dashboard but sidebar is also child of account and courses page. Here in dashboard if we pass coursesData as props to sidebar then there would not be a single source of truth for the sidebar as account and courses page do not pass props to sidebar. Therefore, we use redux store as a single source of truth where the sidebar's state will be updated with the courses data
      // If courses are available then dispatch them to the sidebar as well

      allCourses = this.state.courses;

      coursesPresent = (
        <React.Fragment>
          {Object.keys(allCourses).map(key => (
            <Col className="py-3 mx-2" span={6}>
              <CourseCard course={allCourses[key]} />
            </Col>
          ))}
        </React.Fragment>
      );
    }

    console.log(cookie.load("cookie"));
    if (!cookie.load("cookie")) {
      console.log("Redirecting to Login...");
      return <Redirect to="/" />;
    } else {
      console.log("Staying on Dashboard...");
      const { Header, Content, Footer, Sider } = Layout;
      return (
        <div>
          <Layout>
            <SideBar course={allCourses} />
          </Layout>
          <Layout style={{ marginLeft: 150 }}>
            {/* <Header style={{ background: "#fff" }} /> */}
            <Content
              style={{
                background: "#fff",
                padding: 24,
                minHeight: 470
              }}
            >
              <div>
                <Row>{coursesPresent}</Row>
              </div>
            </Content>
          </Layout>
        </div>
      );
    }
  }
}

export default connect(null)(Dashboard);
