import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux"; // Connects the components to the redux store

import { postEditData } from "../../_actions/user.actions"; // FIXME REMOVE THIS and its call as it was only included for redux homework shim

import { Form, Col, InputGroup, Button, ButtonGroup, ToggleButton } from "react-bootstrap"; // for the new user modal
import API from "../../_helpers/API";

class Edit extends Component {
  state = {
    message: ""
  };

  handleSubmit = event => {
    console.log("Submit Clicked!");
    const form = event.currentTarget;

    console.log("Sending Edit Profile Data!");
    const { loginRequest } = this.props; // redux state to props

    let data = {
      // data is accessible at the backend by req.body.query
      AboutMe: this.refs.aboutme.value,
      Gender: this.refs.gender.value,
      ContactNo: this.refs.contactno.value,
      City: this.refs.city.value,
      Country: this.refs.country.value,
      Company: this.refs.company.value,
      School: this.refs.school.value,
      Hometown: this.refs.hometown.value,
      Languages: this.refs.languages.value,
      email: loginRequest.email
    };
    console.log("XXXXXXXXXXXX", data);
    // FIXME Remove redux from edit.js if there is no use
    const { dispatch } = this.props;
    dispatch(postEditData(data));
    //
    API.post("profile", {
      // data is accessible at the backend by req.body.query
      data
    })
      .then(response => {
        console.log("Edit successful!");
        // message.success(response.data); // cant use antd message as this message would be shown on profile page which is darkened when the modal is open
        this.setState({ message: `${response.data}` });
      })
      .catch(err => console.log(err));

    event.preventDefault(); // dont do default - default is submitting the data to the database
    event.stopPropagation(); // dont propogate event to parents
  };

  render() {
    return (
      // https://react-bootstrap.netlify.com/components/forms/?#forms
      <div className="p-4">
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Form.Row>
            <Form.Group as={Col} className="px-3" controlId="Aboutme">
              <Form.Label>About me</Form.Label>
              <Form.Control as="textarea" rows="3" placeholder="Enter about me" ref="aboutme" />
            </Form.Group>
            <Form.Group as={Col} className="px-3" controlId="Gender">
              <Form.Label>Gender</Form.Label>
              <Form.Control type="text" placeholder="Enter gender" ref="gender" />
            </Form.Group>
          </Form.Row>
          <br />
          <Form.Row>
            <Form.Group as={Col} className="px-3" controlId="contactno">
              <Form.Label>Contact No</Form.Label>
              <InputGroup>
                <Form.Control type="number" placeholder="Enter contact number" ref="contactno" />
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} className="px-3" controlId="city">
              <Form.Label>City</Form.Label>
              <InputGroup>
                <Form.Control type="text" placeholder="Enter city" ref="city" />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} className="px-3" controlId="country">
              <Form.Label>Country</Form.Label>
              <InputGroup>
                <Form.Control type="text" placeholder="Enter country" ref="country" />
              </InputGroup>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} className="px-3" controlId="company">
              <Form.Label>Company</Form.Label>
              <InputGroup>
                <Form.Control type="text" placeholder="Enter company" ref="company" />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} className="px-3" controlId="school">
              <Form.Label>School</Form.Label>
              <InputGroup>
                <Form.Control type="text" placeholder="Enter school" ref="school" />
              </InputGroup>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} className="px-3" controlId="hometown">
              <Form.Label>Hometown</Form.Label>
              <InputGroup>
                <Form.Control type="text" placeholder="Enter hometown" ref="hometown" />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} className="px-3" controlId="languages">
              <Form.Label>Languages</Form.Label>
              <InputGroup>
                <Form.Control type="text" placeholder="Enter languages" ref="languages" />
              </InputGroup>
            </Form.Group>
          </Form.Row>
          <br />
          <div className="text-success">{this.state.message}</div>
          <br />
          <div>
            <Button className="shadow" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(Edit);
