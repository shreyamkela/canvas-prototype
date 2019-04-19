import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux"; // Connects the components to the redux store
import axios from "axios";
import cookie from "react-cookies";

//import './App.css';
import Dashboard from "../HomePage/Dashboard";
import Profile from "../ProfilePage/Profile";
import Courses from "../Courses/Courses";
import Create from "../Courses/Create"; // Create a course
import SideBar from "../Sidebar/SideBar";
import Enroll from "../Courses/Enroll";
import Login from "../LoginPage/Login";
import Inbox from "../Inbox/Inbox";

import { courseDataToComponent } from "../../_actions/user.actions";

import { Layout } from "antd";
import API from "../../_helpers/API";

class Main extends Component {
  async componentDidMount() {
    const { loginRequest } = this.props;

    const data = { email: loginRequest.email, persona: loginRequest.persona };
    try {
      let response = await API.get("getcourses", { params: data });
      // you can access your data here
      //console.log("courses response:", response.data);

      let { dispatch } = this.props;

      dispatch(courseDataToComponent(response.data)); // NOTE Posting course data to sidebar so that the courses drawer can show the courses. Also, here the sidebar is a child of dashboard but sidebar is also child of account and courses page. Here in dashboard if we pass coursesData as props to sidebar then there would not be a single source of truth for the sidebar as account and courses page do not pass props to sidebar. Therefore, we use redux store as a single source of truth where the sidebar's state will be updated with the courses data
      // If courses are available then dispatch them to the sidebar as well
    } catch (error) {
      console.log(error.response);
    }
  }

  render() {
    console.log("MAIN Called!", loginRequest);
    const { Header, Content, Footer, Sider } = Layout;
    const { loginRequest } = this.props; // redux state to props
    console.log("MAIN Called!", loginRequest);

    // NOTE For this project we are fetching all data from server on login and then populating all the components in our app with that data. Actually we should be rendering from props in each component first then also include api calls in each component so that any new data can be updated and then dispatch this change back to the store.
    let persona = null; // Showing email and persona on the header of main
    if (loginRequest.persona == 1) {
      persona = "Faculty - ";
    } else if (loginRequest.persona == 2) {
      persona = "Student - ";
    }

    if (!cookie.load("cookie") && (loginRequest.persona !== "1" || loginRequest.persona !== "2")) {
      return <Login />;
    } else {
      let pageHeading = null;
      if (window.location.pathname.includes("profile")) {
        pageHeading = "Profile";
      } else if (
        window.location.pathname.includes("create") ||
        window.location.pathname.includes("enroll") ||
        window.location.pathname.includes("courses")
      ) {
        pageHeading = "Courses";
      } else if (window.location.pathname.includes("inbox")) {
        pageHeading = "Inbox";
      } else {
        pageHeading = "Dashboard";
      }

      return (
        <React.Fragment>
          <Layout>
            {/* <Header
            style={{
              background: "#fff"
            }}
          /> */}
            <SideBar />
            {/** All valid routes must be declared here for routing to work */}
            {/* App Component Has a Child Component called Login*/}
            <header
              style={{
                background: "#fff",
                textAlign: "left",
                marginLeft: 150,
                borderBottom: "1px solid #e9e9e9"
              }}
            >
              <div className="px-4 py-2">
                <font size="5" color="grey">
                  {pageHeading}
                </font>
              </div>
            </header>
            <Content>
              {/* Layout inside layout would make the internal layout towards the right of parent layout i.e horizontally. All the components inside a layout would be displayed vertically from top to bottom */}
              <Layout>
                <Switch>
                  <Route path="/profile" component={Profile} />
                  <Route path="/courses/:id" component={Courses} />
                  {/* FIXME Make create route inside the courses file*/}
                  <Route path="/create" component={Create} /> {/* FIXME Configure create and enroll route inside the courses file*/}
                  <Route path="/enroll" component={Enroll} />
                  <Route path="/inbox" component={Inbox} />
                  <Route path="/(home|)" component={Dashboard} />
                  {/* Handling home and / routes */}
                  <Route path="*" component={Dashboard} />
                  {/* Handling 404 routes */}
                </Switch>
              </Layout>
            </Content>
            <footer
              style={{
                background: "#fff",
                textAlign: "center",
                marginLeft: 150,
                borderTop: "1px solid #e9e9e9"
              }}
            >
              {/* FIXME this footer div is outside the screen, make it inside and auto */}
              <font size="5" color="00CCFF">
                {persona}
                {loginRequest.email}
              </font>
            </footer>
          </Layout>
        </React.Fragment>
      );
    }
  }
}

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(Main);
