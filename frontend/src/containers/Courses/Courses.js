// Home page is the dashboard page

import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import { Layout } from "antd";

import CourseMenu from "./CourseMenu/CourseMenu";
import Announcements from "./CourseMenu/Announcements";

class Courses extends Component {
  handleLogOut = () => {
    // FIXME Handle logout with state? So that we dont have to include handleLogOut() into each and every page code
    console.log("Log Out Clicked!");
  };

  render() {
    const { Header, Content } = Layout;

    const { id } = this.props.match.params; // Course Id passed through :id while routing to this page
    const { courseDataToSidebar } = this.props; // redux state to propsl
    let allCourses = null;
    let currentCourse = null;
    let courseTitle = null;

    let announcementsUrl = null;
    let assignmentsUrl = null;
    let filesUrl = null;
    let peopleUrl = null;
    let quizzesUrl = null;
    let courseUrl = null;

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

        announcementsUrl = `/courses/${allCourses[key].Id}/announcements`;
        assignmentsUrl = `/courses/${allCourses[key].Id}/assignments`;
        filesUrl = `/courses/${allCourses[key].Id}/files`;
        peopleUrl = `/courses/${allCourses[key].Id}/people`;
        quizzesUrl = `/courses/${allCourses[key].Id}/quizzes`;
        courseUrl = `/courses/${allCourses[key].Id}`;
      }
    }

    return (
      <div>
        <Layout style={{ marginLeft: 150 }}>
          <CourseMenu courseurl={courseUrl} />

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
                <Route path={announcementsUrl} component={Announcements} />
                <Route path={assignmentsUrl} component={Announcements} />
                <Route path={peopleUrl} component={Announcements} />
                <Route path={filesUrl} component={Announcements} />
                <Route path={quizzesUrl} component={Announcements} />
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
