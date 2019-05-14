import React, { Component } from "react";
import { newUserMutation } from "../../mutation/mutations";
import { graphql, compose } from "react-apollo";
import { withApollo } from "react-apollo";

import { Form, Col, InputGroup, Button, ButtonGroup, ToggleButton } from "react-bootstrap"; // for the new user modal

class Register extends Component {
  state = {
    persona: 0, // persona 0 is persona not set, 1 is faculty, and 2 is student
    message: ""
  };

  handleToggle = event => {
    if (event.target.value === "1") {
      this.setState({ persona: 2, message: "" });
    } else if (event.target.value === "2") {
      this.setState({ persona: 1, message: "" });
    }
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
      this.props
        .newUserMutation({
          variables: {
            firstName: this.refs.firstName.value,
            lastName: this.refs.lastName.value,
            email: this.refs.email.value,
            password: this.refs.password.value,
            persona: this.refs.persona.value
          }
        })
        .then(res => {
          console.log("newval " + JSON.stringify(res));
        });
      event.preventDefault(); // dont do default - default is submitting the data to the database
      event.stopPropagation(); // dont propogate event to parents
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
              <ToggleButton variant="outline-primary" type="radio" name="radio" value="1" onClick={this.handleToggle}>
                Student
              </ToggleButton>
              <ToggleButton variant="outline-primary" type="radio" name="radio" value="2" onClick={this.handleToggle}>
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

export default compose(graphql(newUserMutation, { name: "newUserMutation" }))(withApollo(Register));
