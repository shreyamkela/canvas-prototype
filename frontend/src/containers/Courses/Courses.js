// Home page is the dashboard page

import React, { Component } from "react";

import { connect } from "react-redux";

import { Layout } from "antd";

import CourseMenu from "./CourseMenu/CourseMenu";

class Courses extends Component {
  handleLogOut = () => {
    // FIXME Handle logout with state? So that we dont have to include handleLogOut() into each and every page code
    console.log("Log Out Clicked!");
  };

  render() {
    const { Header, Content } = Layout;

    const { id } = this.props.match.params; // Course Id passed through :id while routing to this page
    const { courseDataToSidebar } = this.props; // redux state to props
    let allCourses = null;
    let currentCourse = null;
    let courseTitle = null;

    if (courseDataToSidebar.courses == undefined) {
      allCourses = null;
    } else {
      allCourses = courseDataToSidebar.courses;
    }

    for (var key in allCourses) {
      // To find which is the current course clicked, inside courseDataToSidebar
      if (allCourses[key].Id === undefined) {
        continue;
      } else if (allCourses[key].Id === id) {
        currentCourse = allCourses[key];
        courseTitle = `${allCourses[key].Id} - ${allCourses[key].Name}`;
      }
    }

    return (
      <div>
        <Layout style={{ marginLeft: 150 }}>
          <CourseMenu />

          <Layout>
            <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
              <font size="4">
                <b>{courseTitle}</b>
              </font>
            </Header>
            <Content
              style={{
                background: "#fff",
                minHeight: 470
              }}
            >
              <div>
                <Route path="/" component={Dashboard} />
                <Route path="/profile" component={Profile} />
                <Route path="/courses/:id" component={Courses} />
                {/* FIXME Make create route inside the courses file*/}
                <Route path="/create" component={Create} /> {/* FIXME Make create route inside the courses file*/}
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { courseDataToSidebar } = state;
  return { courseDataToSidebar };
}

export default connect(mapStateToProps)(Courses);
