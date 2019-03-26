import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux"; // Connects the components to the redux store

import { postRegistrationData } from "../../_actions/user.actions"; // FIXME REMOVE THIS and its call

import { Form, Col, InputGroup, Button, ButtonGroup, ToggleButton } from "react-bootstrap"; // for the new user modal

class Register extends Component {
  state = {
    persona: 0, // persona 0 is persona not set, 1 is faculty, and 2 is student
    message: ""
  };

  handleSubmit = event => {
    console.log("Register Clicked!");
    const form = event.currentTarget;

    if (form.checkValidity() === false || this.state.persona === 0) {
      event.preventDefault(); // dont do default - default is submitting the data to the database
      event.stopPropagation(); // dont propogate event to parents

      if (this.state.persona === 0) {
        console.log("Select a Persona: Student or Faculty.");
        this.setState({ message: "Select a Persona: Student or Faculty." });
      }
    } else {
      console.log("Sending Registration Data!");
      let data = {
        // data is accessible at the backend by req.body.query
        firstname: this.refs.firstname.value,
        lastname: this.refs.lastname.value,
        email: this.refs.email.value,
        password: this.refs.password.value,
        persona: this.state.persona
      };
      // FIXME Remove redux from register.js if there is no use
      const { dispatch } = this.props;
      dispatch(postRegistrationData(data));
      //
      axios
        .post("http://localhost:3001/newuser", {
          // data is accessible at the backend by req.body.query
          data
        })
        .then(response => {
          console.log("Registration successful!");

          this.setState({ message: `${response.data}` });
        })
        .catch(err => {
          // If bad request 400 status sent from backend - email already taken
          console.log("Email already registered!");
          this.setState({ message: "Email already registered!" });
        });
    }
  };

  render() {
    console.log("Persona:", this.state.persona);

    return (
      // https://react-bootstrap.netlify.com/components/forms/?#forms
      <div className="p-4">
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Form.Row>
            <Form.Group as={Col} className="px-3" controlId="validationCustom01">
              <Form.Label>First name</Form.Label>
              <Form.Control required type="text" placeholder="Enter first name" ref="firstname" />
            </Form.Group>
            <Form.Group as={Col} className="px-3" controlId="validationCustom02">
              <Form.Label>Last name</Form.Label>
              <Form.Control required type="text" placeholder="Enter last name" ref="lastname" />
            </Form.Group>
          </Form.Row>
          <br />
          <Form.Row>
            <Form.Group as={Col} className="px-3" controlId="validationCustomEmail">
              <Form.Label>E-mail</Form.Label>
              <InputGroup>
                <Form.Control required type="email" placeholder="Enter email" ref="email" />
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} className="px-3" controlId="validationCustomPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control required type="password" placeholder="Enter password" ref="password" />
                {/** type="password" makes the password dotted */}
              </InputGroup>
            </Form.Group>
          </Form.Row>
          <br />
          <div className="d-flex flex-column mb-4">
            <ButtonGroup toggle className="mt-3">
              <ToggleButton
                variant="outline-primary"
                type="radio"
                name="radio"
                value="1"
                onClick={() => {
                  this.setState({ persona: 2, message: "" });
                }}
              >
                Student
              </ToggleButton>
              <ToggleButton
                variant="outline-primary"
                type="radio"
                name="radio"
                value="2"
                onClick={() => {
                  this.setState({ persona: 1, message: "" });
                }}
              >
                Faculty
              </ToggleButton>
            </ButtonGroup>
            <br />
            <div className="text-danger">{this.state.message}</div>
          </div>
          <div>
            <Button className="shadow" type="submit">
              Register
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(null)(Register);
