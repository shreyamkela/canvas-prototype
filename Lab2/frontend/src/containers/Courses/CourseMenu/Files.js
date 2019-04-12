import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import axios from "axios";
import { Link } from "react-router-dom";

import { Button, Modal, Upload, Icon, message } from "antd";
import { Form, Col } from "react-bootstrap"; // for the new user modal

class Files extends Component {
  // ANCHOR 1
  state = {
    visible: false,
    validated: false,
    redirect: false,
    filesPresent: "",
    message: ""
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = async e => {
    let { dispatch, loginRequest, currentCourseDataToComponent } = this.props;
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault(); // dont do default - default is submitting the data to the database
      e.stopPropagation(); // dont propogate event to parents
    } else if (this.refs.title.value != "") {
      // ANCHOR 1
      //Only dispatch when both fields are non empty
      let data = {
        title: this.refs.title.value,
        email: loginRequest.email,
        courseId: currentCourseDataToComponent.currentCourse.Id,
        path: `${currentCourseDataToComponent.currentCourse.Id}`
      };
      try {
        let response = await axios.post("http://localhost:3001/files", { data });
        this.setState({ visible: false });
      } catch (error) {
        console.log(error.response);
      }

      // ANCHOR 2
      this.setState({ redirect: true, message: `Upload successful!` }); // Update creation message
    }
    this.setState({ validated: true });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  async componentDidMount() {
    const { loginRequest, currentCourseDataToComponent } = this.props;
    const data = {
      courseId: currentCourseDataToComponent.currentCourse.Id
    };

    try {
      let response = await axios.get("http://localhost:3001/files", { params: data });
      let allFiles = (
        <React.Fragment>
          <table>
            <tr>
              <th>Name</th>
              <th />
            </tr>

            {Object.keys(response.data).map(key => (
              <tr>
                <td>{response.data[key].name}</td>
                <td>
                  <Link to={response.data[key].document}>Download</Link>
                </td>
              </tr>
            ))}
          </table>
        </React.Fragment>
      );
      this.setState({ filesPresent: allFiles });
    } catch (error) {
      console.log(error.response);
    }
  }

  render() {
    const { validated } = this.state; // form validations

    const { loginRequest } = this.props;
    let filesButton = null;
    if (loginRequest.persona == "1") {
      // If persona is faculty then only show the button
      filesButton = (
        <Button type="primary" shape="round" size="large" icon="plus" onClick={this.showModal}>
          File
        </Button>
      );
    }
    const props = {
      name: "file",
      action: "http://localhost:3001/files",
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
          <div>{filesButton}</div>
          <div>{this.state.filesPresent}</div>
          <Modal title="Upload an file:" visible={this.state.visible} onOk={e => this.handleOk(e)} onCancel={this.handleCancel}>
            <Form noValidate validated={validated}>
              <Form.Group as={Col} controlId="validationTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control required type="text" placeholder="Enter Title" ref="title" />
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

// ANCHOR 2

function mapStateToProps(state) {
  const { loginRequest, currentCourseDataToComponent } = state;
  return { loginRequest, currentCourseDataToComponent };
}

export default connect(mapStateToProps)(Files);
