import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import axios from "axios";
import { Link } from "react-router-dom";

import { Button, Modal, Upload, Icon, message } from "antd";
import { Form, Col } from "react-bootstrap"; // for the new user modal

class Quizzes extends Component {
  // ANCHOR 1
  state = {
    visible: false,
    validated: false,
    redirect: false,
    quizzes: "",
    takeQuiz: "",
    addQuestions: "",
    viewSubmissions: "",
    viewStudentSubmission: "",
    message: ""
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    let { dispatch, loginRequest, currentCourseDataToComponent } = this.props;
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault(); // dont do default - default is submitting the data to the database
      e.stopPropagation(); // dont propogate event to parents
    } else if (this.refs.title.value != "" && this.refs.desc.value != "") {
      //Only dispatch when both fields are non empty
      let data = {
        desc: this.refs.desc.value,
        title: this.refs.title.value,
        email: loginRequest.email,
        courseId: currentCourseDataToComponent.currentCourse.Id,
        questions: this.refs.questions.value,
        options: this.refs.options.value,
        answers: this.refs.answers.value
      };
      this.setState({ redirect: true, message: "Quiz creation successful!" }); // Update creation message
    }
    this.setState({ validated: true });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleTakeQuiz = async key => {
    const { loginRequest, currentCourseDataToComponent } = this.props;

    const data = {
      email: loginRequest.email,
      courseId: currentCourseDataToComponent.currentCourse.Id,
      name: this.state.quizzes[key].name
    };

    try {
      let response = await axios.get("http://localhost:3001/takequiz", { params: data });
      this.setState({ takeQuiz: response.data });
    } catch (error) {
      console.log(error.response);
    }
  };

  handleQuizSubmit = async e => {
    const { loginRequest, currentCourseDataToComponent } = this.props;

    const data = {
      email: loginRequest.email,
      courseId: currentCourseDataToComponent.currentCourse.Id,
      name: this.state.quizzes[e.target.id].name,
      options: e.target.value
    };

    try {
      let response = await axios.post("http://localhost:3001/quiz", { data });
      this.setState({ takeQuiz: "" });
    } catch (error) {
      console.log(error.response);
    }
  };

  handleAddQuestion = () => {
    let addQuestions = this.set.addQuestions;
    addQuestions =
      addQuestions +
      (
        <div>
          Question:
          <input type="text" name="option1" placeholder="Enter option" />
          <input type="text" name="option2" placeholder="Enter option" />
          <input type="text" name="option3" placeholder="Enter option" />
          <input type="text" name="option4" placeholder="Enter option" />
          <br />
          Correct Answer:
          <input type="radio" name="option" value="0" />
          <input type="radio" name="option" value="1" />
          <input type="radio" name="option" value="2" />
          <input type="radio" name="option" value="3" />
        </div>
      );
    this.setState({ addQuestions: addQuestions });
  };

  handleViewSubmissions = async key => {
    const { loginRequest, currentCourseDataToComponent } = this.props;
    const data = {
      email: loginRequest.email,
      persona: loginRequest.persona,
      courseId: currentCourseDataToComponent.currentCourse.Id,
      name: this.state.quizzes[key].name
    };

    try {
      let response = await axios.get("http://localhost:3001/quiz", { params: data });
      this.setState({ viewSubmissions: response.data });
    } catch (error) {
      console.log(error.response);
    }
  };

  handleViewStudentSubmission = key => {
    this.setState({ viewStudentSubmission: this.state.viewSubmissions[key] });
  };

  handleGradeSubmit = async e => {
    const { loginRequest, currentCourseDataToComponent } = this.props;

    const data = {
      email: loginRequest.email,
      courseId: currentCourseDataToComponent.currentCourse.Id,
      name: this.state.assignments[e.target.id],
      grade: e.target.value,
      type: 2
    };

    try {
      let response = await axios.post("http://localhost:3001/grade", { data });
    } catch (error) {
      console.log(error.response);
    }
  };

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
            this.handleTakeQuiz();
            // this.handleTakeQuiz(key); // This is how we can pass a variable with onCLick in react. Ifwe dont use the () => then this.handleEnroll becomes a normal function and it will be called as soon a this button is rendered. It wount wait for the click
          }}
        >
          Submit
        </button>
      );
    }

    let allSubmissions = null;
    allSubmissions = (
      <React.Fragment>
        {Object.keys(this.state.quizzes).map(key => (
          <div>
            <Link to="#" onCLick={this.handleViewStudentSubmission(key)}>
              <font size="4">{this.state.viewSubmissions[key].name}</font>
            </Link>
            {this.state.viewStudentSubmission}
            <div>
              <h4>Grade</h4>
              <input type="number" value="Enter grade" />
              <Button className="shadow" type="primary" onClick={this.handleGradeSubmit(key)}>
                Submit
              </Button>
            </div>
          </div>
        ))}
      </React.Fragment>
    );

    let quizPresent = null;
    if (this.state.quizzes === "noQuizzes") {
      quizPresent = (
        <font className="font-weight-bold" size="3">
          No quizzes available{/**If no quizzes present */}
        </font>
      );
    } else if (this.state.quizzes.length > 0) {
      // there is something other than noquizzes
      quizPresent = (
        <React.Fragment>
          {Object.keys(this.state.quizzes).map(key => (
            <div key={key}>
              <div className="card" style={{ width: 600 }}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm">
                      <h5 className="card-title">{this.state.quizzes[key].Name}</h5>
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
                      <b>Due by: {this.state.quizzes[key].DueBy}</b>
                    </p>
                    <p className="card-text mx-4">
                      <b>Points: {this.state.quizzes[key].Points}</b>
                    </p>
                  </div>
                  <p className="card-text">{this.state.quizzes[key].Description}</p>
                </div>
              </div>
              <br />
            </div>
          ))}
        </React.Fragment>
      );
    }
    let quizButton = null;
    if (loginRequest.persona == "1") {
      // If persona is faculty then only show the button
      quizButton = (
        <Button type="primary" shape="round" size="large" icon="plus" onClick={this.showModal}>
          Quiz
        </Button>
      );
    }

    let takeQuiz = null;
    if (this.state.takeQuiz != "") {
      takeQuiz = (
        <React.Fragment>
          <Form onSubmit={this.handleQuizSubmit}>
            {Object.keys(this.state.takeQuiz).map(key => (
              <div>
                <div>{this.state.takeQuiz[key].question}</div>
                <input type="radio" name="option" value="0">
                  {this.state.takeQuiz[key].options[0]}
                </input>
                <br />
                <input type="radio" name="option" value="1">
                  {this.state.takeQuiz[key].options[1]}
                </input>
                <br />
                <input type="radio" name="option" value="2">
                  {this.state.takeQuiz[key].options[2]}
                </input>
                <br />
                <input type="radio" name="option" value="3">
                  {this.state.takeQuiz[key].options[3]}
                </input>
              </div>
            ))}
          </Form>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div style={{ textAlign: "right", marginRight: 20 }}>
          <div>{takeQuiz}</div>
          <div>{quizButton}</div>
          <div>{quizPresent}</div>
          <Modal title="Create a quiz:" visible={this.state.visible} onOk={e => this.handleOk(e)} onCancel={this.handleCancel}>
            <Form noValidate validated={validated}>
              <Form.Group as={Col} controlId="validationTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control required type="text" placeholder="Enter Title" ref="title" />
              </Form.Group>
              <Form.Group as={Col} controlId="validationDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control required as="textarea" rows="3" placeholder="Enter Description" ref="desc" />
              </Form.Group>
              <Form.Group as={Col} controlId="validationDueBy">
                <Form.Label>Due By</Form.Label>
                <Form.Control required as="date" placeholder="Enter Date" ref="dueBy" />
              </Form.Group>
              <Form.Group as={Col} controlId="validationPoints">
                <Form.Label>Points</Form.Label>
                <Form.Control required as="number" placeholder="Enter Points" ref="points" />
              </Form.Group>
            </Form>
            {this.state.addQuestions}
            <Button type="primary" shape="round" size="small" icon="plus" onClick={this.handleAddQuestion}>
              Add question
            </Button>
            <div className="text-success">{this.state.message}</div>
          </Modal>
        </div>
      </React.Fragment>
    );

    // ANCHOR 2
  }
}

function mapStateToProps(state) {
  const { loginRequest, currentCourseDataToComponent } = state;
  return { loginRequest, currentCourseDataToComponent };
}

export default connect(mapStateToProps)(Quizzes);
