import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import { Redirect } from "react-router";

import { Button, Modal, Collapse } from "antd";
import { Form, Col } from "react-bootstrap"; // for the new user modal

import { postAnnouncementData } from "../../../_actions/user.actions";
import API from "../../../_helpers/API";

class Announcements extends Component {
  state = { visible: false, validated: false, redirect: false, message: "", announcements: "" };

  async componentDidMount() {
    const { currentCourseDataToComponent, loginRequest } = this.props; // redux state to props
    const data = { email: loginRequest.email, courseId: currentCourseDataToComponent.currentCourse.Id };

    try {
      let response = await API.get("announcement", { params: data });
      this.setState({ announcements: response.data });
    } catch (error) {
      console.log(error.response);
    }
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    const { announcementCreateRequest, currentCourseDataToComponent, loginRequest } = this.props; // redux state to props
    let { dispatch } = this.props;
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault(); // dont do default - default is submitting the data to the database
      e.stopPropagation(); // dont propogate event to parents
    } else if (this.refs.title.value != "" && this.refs.desc.value != "") {
      // Only dispatch when both fields are non empty
      let data = {
        desc: this.refs.desc.value,
        title: this.refs.title.value,
        email: loginRequest.email,
        courseId: currentCourseDataToComponent.currentCourse.Id
      };
      let previousAnnouncementsData = this.state.announcements;
      let previousAnnouncementsDataLength = Object.keys(previousAnnouncementsData).length;
      previousAnnouncementsData[previousAnnouncementsDataLength] = { Title: `${this.refs.title.value}`, Description: `${this.refs.desc.value}` };
      dispatch(postAnnouncementData(data));
      // this.setState({ redirect: true, message: `${announcementCreateRequest.response}`, visible: false }); // Cannot keep visible as false as if we turn visible as false after the announcement is created, the modal closes but next time when we add announcment, the success message and validation green colour are already visible on the modal without any typing.
      // To solve this - maybe keepr modal as a different component so that is will be rerendered every time?
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

  reverseObject = Obj => {
    // To reverse the allAnnouncements object
    var TempArr = [];
    var NewObj = [];
    for (var Key in Obj) {
      TempArr.push(Key);
    }
    for (var i = 0; i < TempArr.length; i++) {
      NewObj[TempArr.length - 1 - i] = Obj[i];
    }
    return NewObj;
  };

  render() {
    const { validated } = this.state; // form validations
    const { loginRequest } = this.props; // form validations

    let redirectVal = null;
    let redirectLink = `${window.location.pathname}`;
    if (this.state.redirect === true) {
      // If announcement is created then redirect to /courses/<courseid>
      var newRedirectLink = redirectLink.replace("announcements", "");
      redirectVal = <Redirect to={newRedirectLink} />;
    }

    let allAnnouncements = this.state.announcements;
    let announcementPresent = null;
    const Panel = Collapse.Panel;
    if (allAnnouncements === "" || allAnnouncements.length === 0) {
      announcementPresent = (
        <div className="px-4 my-4" style={{ textAlign: "center" }}>
          <font className="font-weight-bold" size="3">
            No announcement available.{/**If no courses present */}
          </font>
        </div>
      );
    } else {
      //Announcements present
      // Order of announcements shown should be front the latest to the oldest. In database, the announcements are saved from oldest to latest, top to bottom. Therefore we have to reverse the allAnnouncements object
      allAnnouncements = this.reverseObject(allAnnouncements);
      announcementPresent = ( // Showing all announcements
        // FIXME Make announcements as link/clickable and route to their own component for each announcement
        <div className="px-4 my-4">
          <Collapse accordion>
            {Object.keys(allAnnouncements).map(key => (
              <Panel header={allAnnouncements[key].Title} style={{ textAlign: "left", fontWeight: "bold" }} key={key}>
                {/* NOTE all the elements inside the map should have unique key */}
                <p style={{ textAlign: "left" }}>{allAnnouncements[key].Description}</p>
              </Panel>
            ))}
          </Collapse>
        </div>
      );
    }
    let announcementButton = null;
    if (loginRequest.persona == "1") {
      // If persona is faculty then only show the button
      announcementButton = (
        <Button type="primary" shape="round" size="large" icon="plus" onClick={this.showModal}>
          Announcement
        </Button>
      );
    }
    // FIXME when an announcement has been added, the page instantly show the new announcement - Do this by updating the announcement list rendered, when a new announcement is sent to db
    return (
      <React.Fragment>
        {redirectVal}
        <div style={{ textAlign: "right", marginRight: 20 }}>
          <div>{announcementButton}</div>

          <div>{announcementPresent}</div>
          <Modal title="Make an announcement:" visible={this.state.visible} onOk={e => this.handleOk(e)} onCancel={this.handleCancel}>
            <Form noValidate validated={validated}>
              {/* FIXME Fix the size of the text boxes. Also, description feild should be a text area */}
              <Form.Group as={Col} controlId="validationTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control required type="text" placeholder="Enter Title" ref="title" />
              </Form.Group>
              <Form.Group as={Col} controlId="validationDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control required as="textarea" rows="3" placeholder="Enter Description" ref="desc" />
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
  const { announcementCreateRequest, currentCourseDataToComponent, loginRequest } = state;
  return { announcementCreateRequest, currentCourseDataToComponent, loginRequest };
}

export default connect(mapStateToProps)(Announcements);
