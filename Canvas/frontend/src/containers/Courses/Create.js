// Home page is the dashboard page

import React, { Component } from "react";
import { Redirect } from "react-router";
import cookie from "react-cookies";
import { connect } from "react-redux";

import { postCreationData } from "../../_actions/user.actions";

import { Typography, Layout } from "antd";

import { Form, Col, InputGroup, Button } from "react-bootstrap"; // for the new user modal

import SideBar from "../Sidebar/SideBar";

class Create extends Component {
  state = {
    validated: false,
    courseErrorMessage: ""
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

  render() {
    const { validated } = this.state;

    const { createRequest } = this.props;
    console.log("createRequest: ", createRequest);

    const { Header, Content, Footer } = Layout;
    const { Title } = Typography;

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
            <Title>Create a Course:</Title>
            <Form className="py-2" noValidate validated={validated} onSubmit={e => this.handleSubmit(e)}>
              <Form.Row className="font-weight-bold">
                {/* FIXME Check if course id is already present? course id only number or cmpe+number */}
                <Form.Group as={Col} md="4" controlId="validationCustom01">
                  <Form.Label>Course Id</Form.Label>
                  <InputGroup>
                    <Form.Control required type="text" ref="courseId" />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom02">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control required type="text" ref="courseName" />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Department</Form.Label>
                  <Form.Control required type="text" ref="dept" />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom04">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" ref="descrip" />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom05">
                  <Form.Label>Room</Form.Label>
                  <InputGroup>
                    <Form.Control required type="text" ref="room" />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom06">
                  <Form.Label>Course Capacity</Form.Label>
                  <InputGroup>
                    <Form.Control required type="number" ref="classCap" />
                    <Form.Control.Feedback type="invalid">Class capacity should be a number.</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom07">
                  <Form.Label>Waitlist Capacity</Form.Label>
                  <InputGroup>
                    <Form.Control required type="number" ref="waitlistCap" />
                    <Form.Control.Feedback type="invalid">Waitlist capacity should be a number.</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom08">
                  <Form.Label>Course Term</Form.Label>
                  <Form.Control required type="text" ref="term" />
                </Form.Group>
              </Form.Row>
              <div className="d-flex flex-column mb-4">
                {/* <div className="personaErrorMessage text-danger">{this.state.personaErrorMessage}</div> */}
              </div>
              ;<Button type="submit">Create</Button>
              <div className="text-success">{createRequest.response}</div>
            </Form>
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

export default connect(mapStateToProps)(Create);
