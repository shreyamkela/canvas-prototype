import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux"; // Connects the components to the redux store

//import './App.css';
import Dashboard from "../HomePage/Dashboard";
import Profile from "../ProfilePage/Profile";
import Courses from "../Courses/Courses";
import Create from "../Courses/Create"; // Create a course
import SideBar from "../Sidebar/SideBar";
import Enroll from "../Courses/Enroll";

import { Layout } from "antd";

class Main extends Component {
  render() {
    const { Header, Content, Footer, Sider } = Layout;
    const { loginRequest } = this.props; // redux state to props
    // NOTE For this project we are fetching all data from server on login and then populating all the components in our app with that data. Actually we should be rendering from props in each component first then also include api calls in each component so that any new data can be updated and then dispatch this change back to the store.
    let persona = null; // Showing email and persona on the header of main
    if (loginRequest.persona == 1) {
      persona = "Faculty - ";
    } else if (loginRequest.persona == 2) {
      persona = "Student - ";
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
          <Content>
            {/* Layout inside layout would make the internal layout towards the right of parent layout i.e horizontally. All the components inside a layout would be displayed vertically from top to bottom */}
            <Layout>
              <Header
                style={{
                  background: "#fff",
                  textAlign: "center",
                  marginLeft: 150,
                  borderBottom: "1px solid #e9e9e9"
                }}
              >
                <font size="5" color="00CCFF">
                  {persona}
                  {loginRequest.email}
                </font>
              </Header>
              <Route exact path="/home" component={Dashboard} />
              <Route path="/profile" component={Profile} />
              <Route path="/courses/:id" component={Courses} />
              {/* FIXME Make create route inside the courses file*/}
              <Route path="/create" component={Create} /> {/* FIXME Configure create and enroll route inside the courses file*/}
              <Route path="/enroll" component={Enroll} />
            </Layout>
          </Content>
        </Layout>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(Main);
