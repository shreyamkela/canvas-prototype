import React, { Component } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { connect } from "react-redux"; // Connects the components to the redux store

import { Layout, Menu, Icon, Drawer, Button, Col } from "antd";

class SideBar extends Component {
  state = { accountDrawerVisible: false, coursesDrawerVisible: false };

  showAccountDrawer = () => {
    this.setState({
      accountDrawerVisible: true
    });
  };

  showCoursesDrawer = () => {
    this.setState({
      coursesDrawerVisible: true
    });
  };

  onClose = () => {
    this.setState({
      accountDrawerVisible: false,
      coursesDrawerVisible: false
    });
  };

  handleLogOut = () => {
    // FIXME On logout click, also remove the email and persona saved in redux store loginRequest
    console.log("Log Out Clicked!");
  };

  render() {
    const { courseDataToSidebar } = this.props; // redux state to props
    let coursesPresent = null;
    let allCourses = null;

    if (courseDataToSidebar.courses === "") {
      coursesPresent = (
        <font className="font-weight-bold" size="3">
          No courses available{/**If no courses present */}
        </font>
      );
    } else {
      allCourses = courseDataToSidebar.courses;
      Object.keys(allCourses).map(key => {
        let linkString = `${allCourses[key].Id}`;
        Object.assign(allCourses[key], { Link: `/courses/${linkString}` });
      });
      coursesPresent = (
        //let link = `/courseview/${this.props.course.Id}`;
        <React.Fragment>
          {Object.keys(allCourses).map(key => (
            // NOTE Dont use <a> for including links in react. As react uses react router to route between pages, therefore, we should only us the Link tag provided by react react. <a> tag can malfunction with react router
            <Link to={allCourses[key].Link} style={{ textDecoration: "underline" }} onClick={this.onClose}>
              {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
              <font size="4">{allCourses[key].Id}</font>
            </Link>
          ))}
        </React.Fragment>
      );
    }

    const { Header, Content, Footer, Sider } = Layout;
    return (
      <div>
        <Layout>
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0
            }}
            width="150"
            collapsible
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline">
              <Menu.Item key="1" onClick={this.showAccountDrawer}>
                <Icon type="user" style={{ color: "white" }} />
                <span className="nav-text">
                  <Link to="#">
                    {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                    <font size="2" color="white">
                      Account
                    </font>
                  </Link>
                </span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="dashboard" style={{ color: "white" }} />
                <span className="nav-text">
                  <Link to="/home">
                    {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                    <font size="2" color="white">
                      Dashboard
                    </font>
                  </Link>
                </span>
              </Menu.Item>
              <Menu.Item key="3" onClick={this.showCoursesDrawer}>
                <Icon type="book" style={{ color: "white" }} />
                <span className="nav-text">
                  <Link to="#">
                    {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                    <font size="2" color="white">
                      Courses
                    </font>
                  </Link>
                </span>
              </Menu.Item>
            </Menu>
          </Sider>
          {/* FIXME Move the drawer after the sider */}
          <Drawer
            title="Account"
            placement="left"
            style={{ textAlign: "center" }}
            width={300}
            onClose={this.onClose}
            visible={this.state.accountDrawerVisible}
          >
            {/* NOTE Dont use <a> for including links in react. As react uses react router to route between pages, therefore, we should only us the Link tag provided by react react. <a> tag can malfunction with react router */}
            <Link to="/profile" style={{ textDecoration: "underline" }} onClick={this.onClose}>
              {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
              <font size="4">Profile</font>
            </Link>

            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "100%",
                borderTop: "1px solid #e9e9e9",
                padding: "10px 16px",
                background: "#fff",
                textAlign: "center"
              }}
            >
              <Button type="primary" onClick={this.handleLogOut}>
                Log Out
              </Button>
            </div>
          </Drawer>
          <Drawer
            title="Courses"
            placement="left"
            style={{ textAlign: "center" }}
            width={300}
            onClose={this.onClose}
            visible={this.state.coursesDrawerVisible}
          >
            {coursesPresent}
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "100%",
                borderTop: "1px solid #e9e9e9",
                padding: "10px 16px",
                background: "#fff",
                textAlign: "center"
              }}
            >
              <Link to="/create" style={{ textDecoration: "underline" }} onClick={this.onClose}>
                {/**FIXME Make routes under the courses page
                NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                <font size="4">Create a Course</font>
              </Link>
            </div>
          </Drawer>
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { courseDataToSidebar } = state;
  return { courseDataToSidebar };
}

export default connect(mapStateToProps)(SideBar);
