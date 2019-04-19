import React, { Component } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap"; // for the new user modal
import { connect } from "react-redux"; // Connects the components to the redux store
import { Redirect } from "react-router";
import cookie from "react-cookies";

import Register from "./Register"; // New user modal form
import canvasImage from "../../_public/images/canvasLogo_light.jpg";
import { postLoginData } from "../../_actions/user.actions";

import { Layout } from "antd";

class Login extends Component {
  state = { showModal: false, validated: false, redirect: false };

  // Registration modal - Toggle the modal by a state property "showModal" - Show a modal if showModal state is true, else dont show
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
      //console.log("Sending Login Data!", this.refs.email.value, this.refs.email, this.refs);
      let data = { email: this.refs.email.value, password: this.refs.password.value };
      dispatch(postLoginData(data));
      // FIXME if password is wrong?
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
    const { Content, Footer, Header } = Layout;

    const { validated } = this.state; // form validations

    const { loginRequest } = this.props; // redux state to props
    console.log("loginRequest: ", loginRequest);
    console.log("Cookie:", cookie.load("cookie"));
    console.log("State of Redirect:", this.state.redirect);
    if (cookie.load("cookie") || loginRequest.persona == "1" || loginRequest.persona == "2") {
      console.log("Redirecting to Home...", loginRequest.response);
      return <Redirect to="/home" />;
    } else {
      return (
        <Layout style={{ height: "100%", width: "100%", background: "light-grey" }}>
          {/* If cookie name is null then redirectVar is /login, else it is null. If redirectVar is /login. the react router routes the page to login, without loading the divs below */}
          <div className="container shadow p-3 mb-5 bg-white rounded" style={{ marginTop: 100, width: 500 }}>
            <div className="login-form ">
              <br />
              <div className="panel" style={{ textAlign: "center" }}>
                <img src={canvasImage} style={{ width: 150 }} />
                <br />
                <br />
                <font size="5">Login</font>
              </div>
              <br />
              <Form className="px-2" noValidate validated={validated} onSubmit={e => this.handleLogin(e)}>
                <Form.Row>
                  <Form.Group as={Col} controlId="validationEmail">
                    <Form.Label>
                      <font size="3">E-mail</font>
                    </Form.Label>
                    <Form.Control required type="email" placeholder="Enter email" ref="email" />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="validationPassword">
                    <Form.Label>
                      <font size="3">Password</font>
                    </Form.Label>
                    <Form.Control required type="password" placeholder="Enter password" ref="password" />
                  </Form.Group>
                </Form.Row>

                <br />
                <div style={{ textAlign: "center" }}>
                  <Button type="submit" className="btn btn-primary btn-block shadow">
                    Submit
                  </Button>
                </div>
              </Form>
              <br />
              <div className="text-danger" style={{ textAlign: "center" }}>
                {loginRequest.response.data}
              </div>
              <div className="px-2">
                Or&nbsp;
                {/* &nbsp; is a space character */}
                <a href="#" onClick={this.handleModalShow}>
                  register now
                </a>
              </div>

              {/* Show a modal if showModal state is true, else dont show */}
              <Modal show={this.state.showModal} onHide={this.handleModalClose} style={{ marginTop: 50 }}>
                <Modal.Header closeButton>
                  <Modal.Title className="px-4">Enter details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Register />
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </Layout>
      );
    }
  }
}

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(Login);
