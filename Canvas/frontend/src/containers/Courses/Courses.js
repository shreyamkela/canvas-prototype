// Home page is the dashboard page

import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import { Layout } from "antd";

import CourseMenu from "./CourseMenu/CourseMenu";
import Announcements from "./CourseMenu/Announcements";
import { currentCourseDataToComponent } from "../../_actions/user.actions";

class Courses extends Component {
  render() {
    const { Header, Content } = Layout;

    const { dispatch } = this.props;
    const { id } = this.props.match.params; // Course Id passed through :id while routing to this page
    const { courseDataToComponent } = this.props; // redux state to propsl
    let allCourses = null;
    let currentCourse = null;
    let courseTitle = null;

    let announcementsUrl = null;
    let assignmentsUrl = null;
    let filesUrl = null;
    let peopleUrl = null;
    let quizzesUrl = null;
    let courseUrl = null;

    if (courseDataToComponent.courses == undefined) {
      allCourses = null;
    } else {
      allCourses = courseDataToComponent.courses;
    }

    for (var key in allCourses) {
      // To find which is the current course clicked, inside courseDataToComponent
      if (allCourses[key].Id === undefined) {
        continue;
      } else if (allCourses[key].Id === id) {
        currentCourse = allCourses[key];
        // FIXME Remove dispatch from render. Render is only for rendering props and state and not for changing state or dispatching to redux
        dispatch(currentCourseDataToComponent(currentCourse)); // dispatch current course data to components that require it
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
  const { courseDataToComponent } = state;
  return { courseDataToComponent };
}

export default connect(mapStateToProps)(Courses);
