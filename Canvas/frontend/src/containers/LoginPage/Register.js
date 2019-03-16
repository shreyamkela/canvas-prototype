import React, { Component } from "react";
import { Form, Col, InputGroup, Button, ButtonGroup, ToggleButton } from "react-bootstrap"; // for the new user modal
import { connect } from "react-redux"; // Connects the components to the redux store

import { postRegistrationData } from "../../_actions/user.actions";

class Register extends Component {
  state = {
    persona: 0, // persona 0 is persona not set, 1 is faculty, and 2 is student
    personaErrorMessage: "",
    validated: false
  };

  handleSubmit = event => {
    let { dispatch } = this.props;
    console.log("Register Clicked!");
    const form = event.currentTarget;

    if (form.checkValidity() === false || this.state.persona === 0) {
      event.preventDefault(); // dont do default - default is submitting the data to the database
      event.stopPropagation(); // dont propogate event to parents

      if (this.state.persona === 0) {
        console.log("Select a Persona: Student or Faculty.");
        this.setState({ personaErrorMessage: "Select a Persona: Student or Faculty." });
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
      dispatch(postRegistrationData(data));
    }
    this.setState({ validated: true });
  };

  render() {
    const { validated } = this.state;
    console.log("Persona:", this.state.persona);
    const { registrationRequest } = this.props;
    console.log("registrationRequest: ", registrationRequest);

    return (
      // https://react-bootstrap.netlify.com/components/forms/?#forms
      <Form noValidate validated={validated} onSubmit={e => this.handleSubmit(e)}>
        <Form.Row>
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>First name</Form.Label>
            <Form.Control required type="text" placeholder="First name" ref="firstname" />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Last name</Form.Label>
            <Form.Control required type="text" placeholder="Last name" ref="lastname" />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustomEmail">
            <Form.Label>E-mail</Form.Label>
            <InputGroup>
              <Form.Control required type="text" placeholder="E-mail" ref="email" />
              <Form.Control.Feedback type="invalid">Please enter your e-mail.</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationCustomPassword">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control type="password" placeholder="Password" required ref="password" />
              {/** type="password" makes the password dotted */}
              <Form.Control.Feedback type="invalid">Please enter a password.</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Form.Row>
        <div className="d-flex flex-column mb-4">
          <ButtonGroup toggle className="mt-3">
            <ToggleButton
              variant="outline-primary"
              type="radio"
              name="radio"
              value="1"
              onClick={() => {
                this.setState({ persona: 2, personaErrorMessage: "" });
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
                this.setState({ persona: 1, personaErrorMessage: "" });
              }}
            >
              Faculty
            </ToggleButton>
          </ButtonGroup>
          <div className="personaErrorMessage text-danger">{this.state.personaErrorMessage}</div>
        </div>
        <Button type="submit">Register</Button>
        <div className="text-danger">{registrationRequest.response}</div>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  const { registrationRequest } = state;
  return { registrationRequest };
}

export default connect(mapStateToProps)(Register);
