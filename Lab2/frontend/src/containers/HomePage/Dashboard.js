// Home page is the dashboard page

import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux"; // Connects the components to the redux store

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
      // If courses are available then dispatch them to the sidebar as well
      this.setState({ courses: response.data }); // FIXME Here we have stored the whole courses data into the redux store. This is not ideal. We dont use redux store for storing stuff that can change on the serverside. We only use redux store to pass props.
      // This is because in distributed systems, another user might update that dataset that we had just dispatched and therefore our dispatch has old data. Therefore we do api calls on all pages and routes and dont pass data using redux.
      // Though api call on each page is expensive but we have to do this if we want updated data, every second. However, one clever usage of redux store could be that we do store all data in redux store but still do api calls on each page.
      // We update the store on each api call. This way, the redux store is always kept up to date and we can use the redux store as a cache and load load from it first (when a page loads) and then do api call to fetch newer data and update the store which will bring the new contents also on the page.
      // This way, we do load some part of the data so that user can atleast see something and doent just show the loading dial, and then as soon as new data arrives from the call to the store, the page renders the new data as well. This is an option but we have to check whether this is actually done in the industry or not. In the industry, pagination is done on frontend and backend to retreive only chunks of data
    } catch (error) {
      console.log(error.response);
    }
  }

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

export default connect(mapStateToProps)(Dashboard);
