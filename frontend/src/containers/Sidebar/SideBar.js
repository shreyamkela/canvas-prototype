import React, { Component } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import cookie from "react-cookies";

import { Layout, Menu, Icon, Drawer, Button, Col } from "antd";

class SideBar extends Component {
  state = { accountDrawerVisible: false, coursesDrawerVisible: false, courses: "" };

  componentDidMount() {
    console.log("CCCCCCCCCCCCCCC", this.props.course);
    // Object.keys(allCourses).map(key => (
    //   //console.log("This course id: ", allCourses[key]);

    //     <CourseCard course={allCourses[key]} />

    // ))
    // let titleString = `${this.props.course.Id} - ${this.props.course.Name}`;
    // let link = `/courseview/${this.props.course.Id}`; // Ex: Endpoint for this course is /view/CMPE273
    // let courseTitle = (
    //   <a href={link}>
    //     <font size="2">{titleString}</font>
    //   </a>
    // );
    // this.setState({ title: courseTitle });
  }

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
    console.log("Log Out Clicked!");
  };

  render() {
    let coursesPresent = null;
    // if (this.state.courses === "noCourses") {
    //   coursesPresent = (
    //     <font className="font-weight-bold" size="3">
    //       No courses available{/**If no courses present */}
    //     </font>
    //   );
    // } else {
    //   let allCourses = this.state.courses;

    //   coursesPresent = (
    //     <React.Fragment>
    //       {Object.keys(allCourses).map(key => (
    //         //console.log("This course id: ", allCourses[key]);
    //         <Col className="py-3 mx-2" span={6}>
    //           <CourseCard course={allCourses[key]} />
    //         </Col>
    //       ))}
    //     </React.Fragment>
    //   );
    // }

    if (!cookie.load("cookie")) {
      console.log("Redirecting to Login...");
      return <Redirect to="/" />;
    } else {
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
                  <Icon type="user" />
                  <span className="nav-text">
                    <Link to="#">
                      {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                      <font size="2">Account</font>
                    </Link>
                  </span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="dashboard" />
                  <span className="nav-text">
                    <Link to="/home">
                      {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                      <font size="2">Dashboard</font>
                    </Link>
                  </span>
                </Menu.Item>
                <Menu.Item key="3" onClick={this.showCoursesDrawer}>
                  <Icon type="book" />
                  <span className="nav-text">
                    <Link to="#">
                      {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                      <font size="2">Courses</font>
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
              <Link to="/courses" style={{ textDecoration: "underline" }} onClick={this.onClose}>
                {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                <font size="4">Courses</font>
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
                <Link to="/create" style={{ textDecoration: "underline" }}>
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
}

export default SideBar;
