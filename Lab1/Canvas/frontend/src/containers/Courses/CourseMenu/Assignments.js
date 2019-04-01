import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import axios from "axios";

import { Button, Modal, Upload, Icon, message } from "antd";
import { Form, Col } from "react-bootstrap"; // for the new user modal

class Assignment extends Component {
  state = { visible: false, validated: false, redirect: false, message: "", assignments: "", fileList: "" };

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
      // Only dispatch when both fields are non empty
      // let data = {
      //   desc: this.refs.desc.value,
      //   title: this.refs.title.value,
      //   email: loginRequest.email,
      //   courseId: currentCourseDataToComponent.currentCourse.Id
      // };
      // dispatch(postAnnouncementData(data));
      //this.setState({ redirect: true, message: `${announcementCreateRequest.response}` }); // Update creation message
      this.setState({ redirect: true, message: `HEY` }); // Update creation message
    }
    this.setState({ validated: true });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

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

    let assignmentPresent = null;
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

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(Assignment);
