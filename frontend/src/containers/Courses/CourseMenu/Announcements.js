import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import { Redirect } from "react-router";

import { Button, Modal } from "antd";
import { Form, Col } from "react-bootstrap"; // for the new user modal

import { postAnnouncementData } from "../../../_actions/user.actions";

class Announcements extends Component {
  state = { visible: false, validated: false, redirect: false, message: "" };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    var { announcementCreateRequest } = this.props; // redux state to props
    let { dispatch } = this.props;
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault(); // dont do default - default is submitting the data to the database
      e.stopPropagation(); // dont propogate event to parents
    } else if (this.refs.title.value != "" && this.refs.desc.value != "") {
      // Only dispatch when both fields are non empty
      let data = { desc: this.refs.desc.value, title: this.refs.title.value };
      dispatch(postAnnouncementData(data));
      this.setState({ redirect: true, message: `${announcementCreateRequest.response}` }); // Update creation message
    }
    this.setState({ validated: true });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
  render() {
    const { validated } = this.state; // form validations

    let redirectVal = null;
    let redirectLink = `${window.location.pathname}`;
    if (this.state.redirect === true) {
      // If announcement is created then redirect to /courses/<courseid>
      var newRedirectLink = redirectLink.replace("announcements", "");
      redirectVal = <Redirect to={newRedirectLink} />;
    }
    return (
      <React.Fragment>
        {redirectVal}
        <div style={{ textAlign: "right", marginRight: 20 }}>
          <Button type="primary" shape="round" size="large" icon="plus" onClick={this.showModal}>
            Announcement
          </Button>
          <Modal title="Make an announcement:" visible={this.state.visible} onOk={e => this.handleOk(e)} onCancel={this.handleCancel}>
            <Form noValidate validated={validated}>
              <Form.Group as={Col} md="4" controlId="validationTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control required type="text" placeholder="Enter Title" ref="title" />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control required type="text" placeholder="Enter Description" ref="desc" />
              </Form.Group>
            </Form>
            <div className="text-success">{this.state.message}</div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { announcementCreateRequest } = state;
  return { announcementCreateRequest };
}

export default connect(mapStateToProps)(Announcements);