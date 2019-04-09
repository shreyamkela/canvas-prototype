import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import axios from "axios";

import { Button, Modal, Upload, Icon, message } from "antd";
import { Form, Col } from "react-bootstrap"; // for the new user modal

class Assignment extends Component {
  state = { visible: false, validated: false, redirect: false, message: "", assignments: "", viewSubmissions: "", fileList: "", document: "" };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    // const { announcementCreateRequest, currentCourseDataToComponent, loginRequest } = this.props; // redux state to props
    let { dispatch } = this.props;
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault(); // dont do default - default is submitting the data to the database
      e.stopPropagation(); // dont propogate event to parents
    } else if (this.refs.title.value != "" && this.refs.desc.value != "") {
      // ANCHOR 1
      //Only dispatch when both fields are non empty
      let data = {
        desc: this.refs.desc.value,
        title: this.refs.title.value,
        email: loginRequest.email,
        courseId: currentCourseDataToComponent.currentCourse.Id
      };
      dispatch(postAssignmentData(data));
      this.setState({ redirect: true, message: `${assignmentCreateRequest.response}` }); // Update creation message
      // ANCHOR 2
      this.setState({ redirect: true, message: `Creation successful!` }); // Update creation message
    }
    this.setState({ validated: true });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  // ANCHOR 1
  handleViewSubmissions = async key => {
    const data = {
      email: loginRequest.email,
      persona: loginRequest.persona,
      courseId: currentCourseDataToComponent.currentCourse.Id,
      name: this.state.assignments[key].name
    };

    try {
      let response = await axios.get("http://localhost:3001/assignment", { params: data });
      this.setState({ viewSubmissions: response.data });
    } catch (error) {
      console.log(error.response);
    }
  };

  handleSubmit = async key => {
    const data = {
      email: loginRequest.email,
      courseId: currentCourseDataToComponent.currentCourse.Id,
      document: this.state.document
    };

    try {
      let response = await axios.get("http://localhost:3001/assignment", { params: data });
      this.setState({ viewSubmissions: response.data });
    } catch (error) {
      console.log(error.response);
    }
  };

  // ANCHOR 2

  // reverseObject = Obj => {
  //   // To reverse the allAnnouncements object
  //   var TempArr = [];
  //   var NewObj = [];
  //   for (var Key in Obj) {
  //     TempArr.push(Key);
  //   }
  //   for (var i = 0; i < TempArr.length; i++) {
  //     NewObj[TempArr.length - 1 - i] = Obj[i];
  //   }
  //   return NewObj;
  // };

  render() {
    const { validated } = this.state; // form validations
    const { loginRequest } = this.props;

    let submitButton = null;
    if (loginRequest.persona == 2) {
      submitButton = (
        <button
          type="button"
          className="btn btn-success btn-sm m-2"
          onClick={() => {
            this.handleSubmit(key); // This is how we can pass a variable with onCLick in react. Ifwe dont use the () => then this.handleEnroll becomes a normal function and it will be called as soon a this button is rendered. It wount wait for the click
          }}
        >
          Submit
        </button>
      );
    }

    let allSubmissions = null;
    if (loginRequest.persona == 2) {
      allSubmissions = (
        <React.Fragment>
          {Object.keys(this.state.assignments).map(key => (
            <div>{this.state.viewSubmissions[key].link}</div>
          ))}
        </React.Fragment>
      );
    }

    let assignmentPresent = null;
    // ANCHOR
    if (this.state.assignments === "noAssignments") {
      assignmentPresent = (
        <font className="font-weight-bold" size="3">
          No assignments available{/**If no assignments present */}
        </font>
      );
    } else if (this.state.assignments.length > 0) {
      // there is something other than noAssignments
      assignmentPresent = (
        <React.Fragment>
          {Object.keys(this.state.assignments).map(key => (
            <div key={key}>
              <div className="card" style={{ width: 600 }}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm">
                      <h5 className="card-title">{this.state.assignments[key].Name}</h5>
                    </div>
                    <div className="col-sm" style={{ textAlign: "right" }}>
                      {/* FIXME Make course as link and open in new page. And there show the submit button view past submissions */}
                      {/* NOTE by specifiying className as button you can make links with <a> tag as a button in bootstrap */}
                      {/* <a href="#" className="btn btn-success">
                        Submit
                      </a> */}
                      {submitButton}
                      <button
                        type="button"
                        className="btn btn-success btn-sm m-2"
                        onClick={() => {
                          this.handleViewSubmissions(key); // This is how we can pass a variable with onCLick in react. Ifwe dont use the () => then this.handleEnroll becomes a normal function and it will be called as soon a this button is rendered. It wount wait for the click
                        }}
                      >
                        View Submissions
                      </button>
                    </div>
                  </div>
                  {allSubmissions}
                  <div className="row" style={{ marginLeft: 1 }}>
                    <p className="card-text mr-4">
                      <b>Due by: {this.state.assignments[key].DueBy}</b>
                    </p>
                    <p className="card-text mx-4">
                      <b>Points: {this.state.assignments[key].Points}</b>
                    </p>
                  </div>
                  <p className="card-text">{this.state.assignments[key].Description}</p>
                </div>
              </div>
              <br />
            </div>
          ))}
        </React.Fragment>
      );
      // ANCHOR

      let assignmentButton = null;
      if (loginRequest.persona == "1") {
        // If persona is faculty then only show the button
        assignmentButton = (
          <Button type="primary" shape="round" size="large" icon="plus" onClick={this.showModal}>
            Assignment
          </Button>
        );
      }
      const props = {
        name: "file",
        action: "http://localhost:3001/assignment",
        headers: {
          authorization: "authorization-text"
        },
        onChange(info) {
          if (info.file.status !== "uploading") {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
          }
        }
      };
      return (
        <React.Fragment>
          <div style={{ textAlign: "right", marginRight: 20 }}>
            <div>{assignmentButton}</div>
            <div>{assignmentPresent}</div>
            <Modal title="Upload an assignment:" visible={this.state.visible} onOk={e => this.handleOk(e)} onCancel={this.handleCancel}>
              <Form noValidate validated={validated}>
                {/* FIXME Fix the size of the text boxes. Also, description feild should be a text area */}
                <Form.Group as={Col} controlId="validationTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control required type="text" placeholder="Enter Title" ref="title" />
                </Form.Group>
                <Form.Group as={Col} controlId="validationDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control required as="textarea" rows="3" placeholder="Enter Description" ref="desc" />
                </Form.Group>
              </Form>
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> Upload
                </Button>
              </Upload>
              <div className="text-success">{this.state.message}</div>
            </Modal>
          </div>
        </React.Fragment>
      );
    }
  }
}

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(Assignment);
