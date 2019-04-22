import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import { Link } from "react-router-dom";
import { Document, Page } from "react-pdf";

import { Button, Modal, DatePicker, message } from "antd";
import moment from "moment";
import { Form, Col } from "react-bootstrap"; // for the new user modal
import API from "../../../_helpers/API";

class Assignment extends Component {
  state = {
    visible: false,
    validated: false,
    redirect: false,
    message: "",
    assignments: "",
    viewSubmissions: "",
    viewSubmissionsKey: "",
    fileList: "",
    document: "",
    numPages: null,
    pageNumber: 1,
    viewDocument: "",
    dueBy: "",
    error: ""
  };

  async componentDidMount() {
    const { currentCourseDataToComponent } = this.props; // redux state to props
    const data = { courseId: currentCourseDataToComponent.currentCourse.courseId };

    try {
      let response = await API.get("allassignments", { params: data });
      this.setState({ assignments: response.data });
    } catch (error) {
      console.log(error.response);
    }
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = async e => {
    let { loginRequest, currentCourseDataToComponent } = this.props;
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault(); // dont do default - default is submitting the data to the database
      e.stopPropagation(); // dont propogate event to parents
      this.setState({ error: "Please fill all the details!" });
    } else if (this.state.dueBy === "") {
      this.setState({ error: "Please fill all the details!" });
    } else if (this.refs.title.value != "" && this.refs.desc.value != "" && this.refs.desc.points != "" && this.state.dueBy != "") {
      // ANCHOR 1
      //Only dispatch when both fields are non empty
      if (this.refs.points.value < 0) {
        this.refs.points.value *= -1;
      }
      let data = {
        persona: loginRequest.persona,
        desc: this.refs.desc.value,
        title: this.refs.title.value,
        courseId: currentCourseDataToComponent.currentCourse.courseId,
        dueBy: this.state.dueBy,
        points: this.refs.points.value
      };
      try {
        let response = await API.post("assignment", { data });
        this.setState({ redirect: true, message: `Creation successful!`, error: "" });
      } catch (error) {
        console.log(error.response);
        this.setState({ message: "", error: "Unable to create assignment!" });
      }
      // dispatch(postAssignmentData(data));
      //this.setState({ redirect: true, message: `${assignmentCreateRequest.response}` }); // Update creation message
      // ANCHOR 2
    }
    this.setState({ validated: true });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      validated: false,
      message: "",
      error: ""
    });
  };

  // ANCHOR 1
  handleViewSubmissions = async id => {
    const { loginRequest, currentCourseDataToComponent } = this.props;
    const data = {
      email: loginRequest.email,
      persona: loginRequest.persona,
      courseId: currentCourseDataToComponent.currentCourse.courseId,
      assignmentId: id
    };

    try {
      let response = await API.get("assignment", { params: data });
      this.setState({ viewSubmissions: response.data, viewSubmissionsKey: id });
    } catch (error) {
      console.log(error.response);
      message.error("Unable to view submissions!");
    }
  };

  handleSubmit = async (id, dueBy) => {
    // Checking whether the student is trying to submit past the due date

    var d = new Date();
    var month = "" + (d.getMonth() + 1);
    var day = "" + d.getDate();
    var year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    var todayDate = [year, month, day].join("-");
    //console.log("RRRRRRRRRRRRRRRRRRRR", todayDate, dueBy);

    if (dueBy >= todayDate) {
      if (this.state.document != "" && this.state.document["assignmentId"] == id) {
        const { loginRequest, currentCourseDataToComponent } = this.props;
        const data = {
          email: loginRequest.email,
          persona: loginRequest.persona,
          courseId: currentCourseDataToComponent.currentCourse.courseId,
          document: this.state.document
        };

        try {
          let response = await API.post("assignment", { data });
          message.success("Uploaded successfully!");
        } catch (error) {
          console.log(error.response);
          message.error("Unable to upload file!");
        }
      } else {
        message.error("Please select a file for this assignment!");
      }
    } else {
      message.error("Cannot submit assignment past its due date!");
    }
  };

  handleSelectFile = id => {
    this.setState({ document: { file: "file", assignmentId: id } });
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  handleViewDocument = key => {
    // const { pageNumber, numPages } = this.state;
    // let viewDocument = (
    //   <div>
    //     <Document file={this.viewSubmissions[key]} onLoadSuccess={this.onDocumentLoadSuccess}>
    //       <Page pageNumber={pageNumber} />
    //     </Document>
    //     <p>
    //       Page {pageNumber} of {numPages}
    //     </p>
    //     <div style={{ width: 300, height: "110vh", position: "fixed", right: 0 }}>
    //       <div className="p-4">
    //         <h4>Grade</h4>
    //         <input type="number" value="Enter grade" />
    //         <Button className="shadow" type="primary" onClick={this.handleGradeSubmit}>
    //           Submit
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // );
    // this.setState({ viewDocument });
  };

  handleGradeSubmit = async e => {
    const { loginRequest, currentCourseDataToComponent } = this.props;

    const data = {
      email: loginRequest.email,
      courseId: currentCourseDataToComponent.currentCourse.Id,
      name: this.state.assignments[e.target.id],
      grade: e.target.value,
      type: 1
    };

    try {
      let response = await API.post("grade", { data });
    } catch (error) {
      console.log(error.response);
    }
  };

  // ANCHOR 2

  reverseObject = Obj => {
    // To reverse the allAssignments object
    var TempArr = [];
    var NewObj = [];
    for (var Key in Obj) {
      TempArr.push(Key);
    }
    for (var i = 0; i < TempArr.length; i++) {
      NewObj[TempArr.length - 1 - i] = Obj[i];
    }
    return NewObj;
  };

  disabledDate = current => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };

  onChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({ dueBy: dateString, error: "" });
  };

  render() {
    const { validated } = this.state; // form validations
    const { loginRequest } = this.props;

    let viewSubmissions = null;
    if (loginRequest.persona == "1") {
      viewSubmissions = (
        <React.Fragment>
          <br />
          {Object.keys(this.state.viewSubmissions).map(key => (
            <div>
              <h6>{key}</h6>
              <div style={{ marginLeft: 40 }}>
                <Link to="#" onCLick={this.handleViewDocument(key)}>
                  <font size="4">{this.state.viewSubmissions[key][this.state.viewSubmissions[key].length - 1]}</font>
                  <br />
                </Link>
              </div>
            </div>
          ))}
        </React.Fragment>
      );
    } else if (loginRequest.persona == "2") {
      viewSubmissions = (
        <React.Fragment>
          <br />
          {Object.keys(this.state.viewSubmissions)
            .reverse()
            .map(key => (
              <Link to="#" onCLick={this.handleViewDocument(key)}>
                <font size="4">{this.state.viewSubmissions[key]}</font>
                <br />
              </Link>
            ))}
        </React.Fragment>
      );
    }

    let assignmentPresent = null;
    if (this.state.assignments === "noAssignments" || this.state.assignments === "" || this.state.assignments.length == 0) {
      assignmentPresent = (
        <div className="px-4 my-4" style={{ textAlign: "center" }}>
          <font className="font-weight-bold" size="3">
            No assignments available{/**If no assignments present */}
          </font>
        </div>
      );
    } else if (this.state.assignments.length > 0) {
      // there is something other than noAssignments

      let allAssignments = this.state.assignments;
      allAssignments = this.reverseObject(allAssignments);
      assignmentPresent = (
        <React.Fragment>
          {Object.keys(allAssignments).map(key => (
            <div key={key} style={{ marginLeft: 150 }}>
              <div className="card" style={{ width: 600 }}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm" style={{ textAlign: "left" }}>
                      <h5 className="card-title">{allAssignments[key].title}</h5>
                    </div>
                    <div className="col-sm" style={{ textAlign: "right" }}>
                      {/* NOTE by specifiying className as button you can make links with <a> tag as a button in bootstrap */}
                      {/* <a href="#" className="btn btn-success">
                        Submit
                      </a> */}
                      {/* Submit assignment button - Only for student */}
                      {loginRequest.persona == 2 ? (
                        <React.Fragment>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm m-2"
                            onClick={() => {
                              this.handleSelectFile(allAssignments[key].assignmentId);
                              // this.handleSubmit(key); // This is how we can pass a variable with onCLick in react. Ifwe dont use the () => then this.handleEnroll becomes a normal function and it will be called as soon a this button is rendered. It wount wait for the click
                            }}
                          >
                            Select file
                          </button>
                          <button
                            type="button"
                            className="btn btn-success btn-sm m-2"
                            onClick={() => {
                              this.handleSubmit(allAssignments[key].assignmentId, allAssignments[key].dueBy);
                              // this.handleSubmit(key); // This is how we can pass a variable with onCLick in react. Ifwe dont use the () => then this.handleEnroll becomes a normal function and it will be called as soon a this button is rendered. It wount wait for the click
                            }}
                          >
                            Submit
                          </button>
                        </React.Fragment>
                      ) : null}
                      {/* View submissions button - Only for faculty */}
                    </div>
                  </div>

                  <p className="card-text" style={{ textAlign: "left" }}>
                    {allAssignments[key].desc}
                  </p>

                  <div className="row" style={{ marginLeft: 1 }}>
                    <p className="card-text mr-4">
                      <b>Due by: {allAssignments[key].dueBy}</b>
                    </p>
                    <p className="card-text mx-4">
                      <b>Points: {allAssignments[key].points}</b>
                    </p>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        this.handleViewSubmissions(allAssignments[key].assignmentId); // This is how we can pass a variable with onCLick in react. Ifwe dont use the () => then this.handleEnroll becomes a normal function and it will be called as soon a this button is rendered. It wount wait for the click
                      }}
                    >
                      View Submissions
                    </button>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    {/* View submissions for this assignment card only - using a state viewSubmissionsKey */}
                    {allAssignments[key].assignmentId == this.state.viewSubmissionsKey ? viewSubmissions : null}
                  </div>
                </div>
              </div>
              <br />
            </div>
          ))}
        </React.Fragment>
      );
    }
    // ANCHOR 2

    let assignmentButton = null;
    if (loginRequest.persona == "1") {
      // If persona is faculty then only show the button
      assignmentButton = (
        <Button type="primary" shape="round" size="large" icon="plus" onClick={this.showModal}>
          Assignment
        </Button>
      );
    }

    return (
      <React.Fragment>
        <div style={{ textAlign: "right", marginRight: 20 }}>
          <div>{assignmentButton}</div>
          <br />
          <br />
          <div>{assignmentPresent}</div>
          <Modal title="Upload an assignment:" visible={this.state.visible} onOk={e => this.handleOk(e)} onCancel={this.handleCancel}>
            <Form noValidate validated={validated}>
              <Form.Group as={Col} controlId="validationTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control required type="text" placeholder="Enter Title" ref="title" />
              </Form.Group>
              <Form.Group as={Col} controlId="validationDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control required as="textarea" rows="3" placeholder="Enter Description" ref="desc" />
              </Form.Group>
              <Form.Group as={Col} controlId="validationPoints">
                <Form.Label>Points</Form.Label>
                <Form.Control required type="number" placeholder="Enter Points" ref="points" />
              </Form.Group>
              <Form.Group as={Col} controlId="validationDueBy">
                <Form.Label>Due By</Form.Label>
                <br />

                <DatePicker format="YYYY-MM-DD" disabledDate={this.disabledDate} onChange={this.onChange} />
              </Form.Group>
            </Form>

            <div className="text-success">{this.state.message}</div>
            <div className="text-danger">{this.state.error}</div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { loginRequest, currentCourseDataToComponent } = state;
  return { loginRequest, currentCourseDataToComponent };
}

export default connect(mapStateToProps)(Assignment);
