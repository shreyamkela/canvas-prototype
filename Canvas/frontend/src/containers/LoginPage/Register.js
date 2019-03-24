import React, { Component } from "react";
import { Form, Col, InputGroup, Button, ButtonGroup, ToggleButton } from "react-bootstrap"; // for the new user modal
import axios from "axios";

class Register extends Component {
  state = {
    persona: 0, // persona 0 is persona not set, 1 is faculty, and 2 is student
    message: "",
    validated: false
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
          // FIXME Modal closes and page reloads even if the email is already registered. Modal should stay put and just display the warning message
          this.setState({ message: "Email already registered!" });
        });
    }
    this.setState({ validated: true });
  };

  render() {
    const { validated } = this.state;
    console.log("Persona:", this.state.persona);

    return (
      // https://react-bootstrap.netlify.com/components/forms/?#forms
      <div className="p-4">
        <Form noValidate validated={validated} onSubmit={e => this.handleSubmit(e)}>
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
                <Form.Control required type="text" placeholder="Enter email" ref="email" />
                <Form.Control.Feedback type="invalid">Please enter your e-mail.</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} className="px-3" controlId="validationCustomPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control type="password" placeholder="Enter password" required ref="password" />
                {/** type="password" makes the password dotted */}
                <Form.Control.Feedback type="invalid">Please enter a password.</Form.Control.Feedback>
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

export default Register;
