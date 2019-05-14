import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux"; // Connects the components to the redux store
import { graphql, compose } from "react-apollo";
import { updateUser } from "../../mutation/mutations";
import { postEditData } from "../../_actions/user.actions"; // FIXME REMOVE THIS and its call as it was only included for redux homework shim
import propTypes from "prop-types";
import { withApollo } from "react-apollo";

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
      aboutMe: this.refs.aboutme.value,
      gender: this.refs.gender.value,
      contactNumber: this.refs.contactno.value,
      city: this.refs.city.value,
      country: this.refs.country.value,
      company: this.refs.company.value,
      school: this.refs.school.value,
      hometown: this.refs.hometown.value,
      languages: this.refs.languages.value,
      email: loginRequest.email
    };
    // FIXME Remove redux from edit.js if there is no use
    // const { dispatch } = this.props;
    // dispatch(postEditData(data));
    //
    this.props.updateUser({
      variables: data
    });

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

Edit.propTypes = {
  updateProfile: propTypes.func.isRequired,
  update: propTypes.string.isRequired
};

const mapStateToProps = state => ({
  update: state.profile.profileFlag,
  getProfile: state.profile.profileData
});

export default compose(graphql(updateUser, { name: "updateUser" }))(withApollo(Edit));
