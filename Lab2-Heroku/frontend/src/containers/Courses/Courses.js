// Home page is the dashboard page

import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import { Layout } from "antd";

import CourseMenu from "./CourseMenu/CourseMenu";
import Announcements from "./CourseMenu/Announcements";
import Assignments from "./CourseMenu/Assignments";
import People from "./CourseMenu/People";
import Files from "./CourseMenu/Files";
import Quizzes from "./CourseMenu/Quizzes";
import Grades from "./CourseMenu/Grades";

import { currentCourseDataToComponent } from "../../_actions/user.actions";

class Courses extends Component {
  render() {
    const { Header, Content } = Layout;

    const { dispatch } = this.props;
    const { id } = this.props.match.params; // Course Id passed through :id while routing to this page

    const { courseDataToComponent, loginRequest } = this.props; // redux state to propsl
    let allCourses = null;
    let currentCourse = null;
    let courseTitle = null;

    let announcementsUrl = null;
    let assignmentsUrl = null;
    let filesUrl = null;
    let peopleUrl = null;
    let quizzesUrl = null;
    let gradesUrl = null;

    let courseUrl = null;
    console.log("CCCCCCCCCCCCCCCCCCCCCC", courseDataToComponent.courses);

    if (courseDataToComponent.courses == undefined) {
      allCourses = null;
    } else {
      allCourses = courseDataToComponent.courses;
    }

    for (var key in allCourses) {
      // To find which is the current course clicked, inside courseDataToComponent
      if (allCourses[key].courseId === undefined) {
        continue;
      } else if (allCourses[key].courseId === id) {
        currentCourse = allCourses[key];
        // FIXME Remove dispatch from render. Render is only for rendering props and state and not for changing state or dispatching to redux
        dispatch(currentCourseDataToComponent(currentCourse)); // dispatch current course data to components that require it
        courseTitle = `${allCourses[key].courseId} - ${allCourses[key].courseName}`;

        announcementsUrl = `/courses/${allCourses[key].courseId}/announcements`;
        assignmentsUrl = `/courses/${allCourses[key].courseId}/assignments`;
        filesUrl = `/courses/${allCourses[key].courseId}/files`;
        peopleUrl = `/courses/${allCourses[key].courseId}/people`;
        quizzesUrl = `/courses/${allCourses[key].courseId}/quizzes`;
        gradesUrl = `/courses/${allCourses[key].courseId}/grades`;
        courseUrl = `/courses/${allCourses[key].courseId}`;
      }
    }
    let gradesRoute = null;
    if (loginRequest.persona === 2) {
      // If student, then include route for grades
      gradesRoute = <Route path={gradesUrl} component={Grades} />;
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
                <Route path={assignmentsUrl} component={Assignments} />
                <Route path={peopleUrl} component={People} />
                <Route path={filesUrl} component={Files} />
                <Route path={quizzesUrl} component={Quizzes} />
                {gradesRoute}
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { courseDataToComponent, loginRequest } = state;
  return { courseDataToComponent, loginRequest };
}

export default connect(mapStateToProps)(Courses);
