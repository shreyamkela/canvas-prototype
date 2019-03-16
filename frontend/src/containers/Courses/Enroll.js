// Home page is the dashboard page

import React, { Component } from "react";
import { Redirect } from "react-router";
import cookie from "react-cookies";
import { connect } from "react-redux";

import { postCreationData } from "../../_actions/user.actions";

import { Typography, Layout, Input, Radio } from "antd";

import { Form, Col, InputGroup, Button } from "react-bootstrap"; // for the new user modal

import SideBar from "../Sidebar/SideBar";

class Enroll extends Component {
  state = {
    validated: false,
    courseErrorMessage: "",
    filterPresent: true,
    value: 1
  };

  handleSubmit = event => {
    let { dispatch } = this.props;
    console.log("Create Clicked!");
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault(); // dont do default - default is submitting the data to the database
      event.stopPropagation(); // dont propogate event to parents
    } else {
      const { loginRequest } = this.props;
      let data = {
        // data is accessible at the backend by req.body.query
        courseId: this.refs.courseId.value,
        courseName: this.refs.courseName.value,
        dept: this.refs.dept.value,
        descrip: this.refs.descrip.value,
        room: this.refs.room.value,
        classCap: this.refs.classCap.value,
        waitlistCap: this.refs.waitlistCap.value,
        term: this.refs.term.value,
        email: loginRequest.email
      };
      dispatch(postCreationData(data));
      // FIXME Redirect to dashboard when a course is successfully created
    }
    this.setState({ validated: true });
  };

  onChange = e => {
    // For radio buttons
    console.log(`radio checked:${e.target.value}`);
    if (e.target.value !== "a") {
      // If course Id button is not selected, then remove the filter
      this.setState({ filterPresent: false });
    } else if (e.target.value === "a" && this.state.filterPresent === false) {
      // If any other button was clicked and course id is clicked again
      this.setState({ filterPresent: true });
    }
  };

  onFilterChange = e => {
    // for filter radios
    console.log(`filter checked:${e.target.value}`);
    this.setState({
      value: e.target.value
    });
  };

  handleLogOut = () => {
    // FIXME Handle logout with state? So that we dont have to include handleLogOut() into each and every page code
    console.log("Log Out Clicked!");
  };

  render() {
    const { validated } = this.state;

    const { createRequest } = this.props;
    //console.log("createRequest: ", createRequest);

    const { Header, Content, Footer } = Layout;
    const { Title } = Typography;
    const Search = Input.Search;
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;

    let filter = null;
    if (this.state.filterPresent === true) {
      filter = (
        <div>
          <font className="font-weight-bold" size="2">
            Filter:
          </font>
          <br />
          <RadioGroup onChange={this.onFilterChange} value={this.state.value}>
            <Radio value={1}>Exact</Radio>
            <Radio value={2}>Greater than</Radio>
            <Radio value={3}>Less than</Radio>
          </RadioGroup>
        </div>
      );
    }

    return (
      <div>
        <Layout>
          <SideBar />
        </Layout>
        {/* FIXME Make the create page a modal */}
        <Layout style={{ marginLeft: 150 }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              minHeight: 470
            }}
          >
            <Title>Enroll into a Course:</Title>

            <Search
              placeholder="Search for a course by id, term, or course name"
              enterButton="Search"
              size="large"
              onSearch={value => console.log(value)}
              style={{ width: 700 }}
            />
            <br />
            <br />
            <div>
              <font className="font-weight-bold" size="2">
                Search by:
              </font>
              <br />
              <Radio.Group onChange={this.onChange} defaultValue="a" buttonStyle="solid" size="large" style={{ marginRight: 10 }}>
                <Radio.Button value="a">Course Id</Radio.Button>
                <Radio.Button value="b">Term</Radio.Button>
                <Radio.Button value="c">Course Name</Radio.Button>
              </Radio.Group>

              <br />
              <br />
              {filter}
            </div>

            <div className="d-flex flex-column mb-4">
              {/* <div className="personaErrorMessage text-danger">{this.state.personaErrorMessage}</div> */}
            </div>
            <div className="text-success">{createRequest.response}</div>
          </Content>
          <Footer style={{ background: "#fff" }} />
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { createRequest, loginRequest } = state;
  return { createRequest, loginRequest };
}

export default connect(mapStateToProps)(Enroll);
