import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store

import { Button, Modal, Input } from "antd";
import { Form, Col } from "react-bootstrap"; // for the new user modal

class Announcements extends Component {
  state = { visible: false, validated: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault(); // dont do default - default is submitting the data to the database
      e.stopPropagation(); // dont propogate event to parents
    } else {
      this.setState({ validated: true });
    }
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
  render() {
    const { validated } = this.state; // form validations
    const { TextArea } = Input;

    return (
      <React.Fragment>
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
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null)(Announcements);
