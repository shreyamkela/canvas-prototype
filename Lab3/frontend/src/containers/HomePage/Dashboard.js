// Home page is the dashboard page

import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import { Redirect } from "react-router";
import { graphql, compose } from "react-apollo";
import { withApollo } from "react-apollo";

import { Layout, Row, Col } from "antd";

import CourseCard from "./CourseCard";
import { courseDataToComponent } from "../../_actions/user.actions";
import API from "../../_helpers/API";

class Dashboard extends Component {
  state = { courses: "" };
  // NOTE For fetching the data once a page loads - No api get call inside constructor. Let page load without any data then do the api get call inside componentDidMount
  async componentDidMount() {
    const { loginRequest } = this.props;
    const data = { email: loginRequest.email, persona: loginRequest.persona };
    try {
      let response = await API.get("getcourses", { params: data });
      // you can access your data here
      //console.log("courses response:", response.data);

      let { dispatch } = this.props;
      dispatch(courseDataToComponent(response.data)); // NOTE Posting course data to sidebar so that the courses drawer can show the courses. Also, here the sidebar is a child of dashboard but sidebar is also child of account and courses page. Here in dashboard if we pass coursesData as props to sidebar then there would not be a single source of truth for the sidebar as account and courses page do not pass props to sidebar. Therefore, we use redux store as a single source of truth where the sidebar's state will be updated with the courses data
      this.props
        .getCourseDetails({
          variables: {
            email: loginRequest.email
          }
        })
        .then(res => {
          console.log("courses " + JSON.stringify(res));
          this.setState({ courses: res.data }); // FIXME Here we have stored the whole courses data into the redux store. This is not ideal. We dont use redux store for storing stuff that can change on the serverside. We only use redux store to pass props.
        });
    } catch (error) {
      console.log(error.response);
    }
  }

  render() {
    const { loginRequest } = this.props;
    let coursesPresent = null;
    let allCourses = null;
    //if not logged in go to login page:
    // At the server end, we use res.cookie command of the express-session library, to set the name 'cookie' to the cookie sent to client, when admin logs in. At react/client end, we can check whether the name is 'cookie' or not, to authenticate.
    // At react/client end, we check the cookie name using cookie.load('cookie') command of the 'react-cookies' library. If cookie.load('cookie') != null this means that the user is admin
    // https://stackoverflow.com/questions/44107665/how-to-access-a-browser-cookie-in-a-react-app
    //console.log("COURSES:", this.state.courses);

    if (this.state.courses === "noCourses" || this.state.courses === "" || this.state.courses[0] === undefined) {
      allCourses = "noCourses";
      coursesPresent = (
        <font className="font-weight-bold" size="3">
          No courses available{/**If no courses present */}
        </font>
      );
    } else {
      allCourses = this.state.courses;
      coursesPresent = (
        <React.Fragment>
          {Object.keys(allCourses).map(key => (
            <Col className="py-3 mx-2" span={6} key={key}>
              <CourseCard course={allCourses[key]} />
            </Col>
          ))}
        </React.Fragment>
      );
    }

    const { Header, Content, Footer, Sider } = Layout;
    if (loginRequest.persona == "0") {
      console.log("Redirecting to Login...", loginRequest.response);
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Layout style={{ marginLeft: 150, minHeight: 560 }}>
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

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(withApollo(Dashboard));
