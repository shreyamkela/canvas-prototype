import React, { Component } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap"; // for the new user modal
import { connect } from "react-redux"; // Connects the components to the redux store
import { Redirect } from "react-router";
import cookie from "react-cookies";

import Register from "./Register"; // New user modal form
import { postLoginData } from "../../_actions/user.actions";

class Login extends Component {
  state = { showModal: false, validated: false, redirect: false };

  // New user model - Toggle the modal by a state property "showModal" - Show a modal if showModal state is true, else dont show
  handleModalClose = () => {
    this.setState({ showModal: false });
  };

  handleModalShow = () => {
    this.setState({ showModal: true });
  };

  handleLogin = event => {
    let { dispatch } = this.props;
    console.log("Login Clicked!");
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault(); // dont do default - default is submitting the data to the database
      event.stopPropagation(); // dont propogate event to parents
    } else {
      console.log("Sending Login Data!", this.refs.email.value, this.refs.email, this.refs);
      let data = { email: this.refs.email.value, password: this.refs.password.value };
      dispatch(postLoginData(data));
      console.log("Redirecting to Home...");
      this.setState({ redirect: true });
    }
    this.setState({ validated: true });
  };

  handleCreateAccount = () => {
    console.log("Create Account Clicked!");
  };

  // console.log("Load New User Modal");
  // install react-bootstrap and refer - https://www.freecodecamp.org/forum/t/reactjs-how-to-assign-an-jsx-element-to-a-variable-and-use-it-in-render-method/230442/4

  render() {
    const { validated } = this.state; // form validations

    const { loginRequest } = this.props; // redux state to props
    //console.log("loginRequest: ", loginRequest);
    console.log("Cookie:", cookie.load("cookie"));
    console.log("State of Redirect:", this.state.redirect);
    if (this.state.redirect === true || cookie.load("cookie")) {
      console.log("Reedirecting to Home...");
      return <Redirect to="/home" />;
    } else {
      return (
        <div>
          {/* If cookie name is null then redirectVar is /login, else it is null. If redirectVar is /login. the react router routes the page to login, without loading the divs below */}
          <div className="row align-items-center justify-content-center">
            <div className="container">
              <div className="login-form border border-default p-4 w-50">
                <div className="panel">
                  <h4>Sign In</h4>
                </div>
                <Form noValidate validated={validated} onSubmit={e => this.handleLogin(e)}>
                  <Form.Row>
                    <Form.Group as={Col} md="4" controlId="validationEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control required type="text" placeholder="Email" ref="email" />
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control required type="text" placeholder="Password" ref="password" />
                    </Form.Group>
                  </Form.Row>
                  <Button type="submit">Login</Button>
                </Form>
                <a href="#" onClick={this.handleModalShow}>
                  New User?
                </a>
                <div className="text-danger">{loginRequest.response}</div>
                {/* Show a modal if showModal state is true, else dont show */}
                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>New User Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Register />
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(Login);
