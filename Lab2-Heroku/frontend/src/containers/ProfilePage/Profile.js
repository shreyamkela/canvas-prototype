import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { Layout, Button } from "antd";
import { Modal } from "react-bootstrap"; // for the edit modal

import Avatar from "./Avatar";
import Edit from "./Edit";
import API from "../../_helpers/API";

class Profile extends Component {
  state = { showModal: false, profile: "" };

  async componentDidMount() {
    // Fetching the full name. Also any profile details if submitted previously
    const { loginRequest } = this.props; // redux state to props
    const data = { email: loginRequest.email };
    try {
      let response = await API.get("profile", { params: data });
      console.log("Profile data response:", response);
      this.setState({ profile: response.data });
    } catch (error) {
      console.log(error.response);
    }
  }

  // Edit modal - Toggle the modal by a state property "showModal" - Show a modal if showModal state is true, else dont show
  handleModalClose = () => {
    const { editRequest } = this.props; // redux state to props
    this.setState({ showModal: false, profile: editRequest.response });
  };

  handleModalShow = () => {
    this.setState({ showModal: true });
  };

  render() {
    const { Header, Content, Footer, Sider } = Layout;
    const { loginRequest } = this.props; // redux state to props

    return (
      <div>
        <Layout style={{ background: "#fff", marginLeft: 150, padding: "0 24px 24px" }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              margin: "16px 0",
              minHeight: 570
            }}
          >
            <div className="row">
              <div className="col">
                <div style={{ marginLeft: 150 }}>
                  <Avatar />
                </div>
              </div>
              <div className="col">
                <h2>
                  {this.state.profile.Firstname} {this.state.profile.Lastname}
                </h2>
                <p>{loginRequest.email}</p>
                <br />

                <b>About me: </b>
                {this.state.profile.AboutMe === null || this.state.profile.AboutMe === undefined ? "" : `${this.state.profile.AboutMe}`}

                <br />
                <br />
                <b>Gender: </b>
                {this.state.profile.Gender === null || this.state.profile.Gender === undefined ? "" : `${this.state.profile.Gender}`}

                <br />
                <br />
                <b>Contact No: </b>
                {this.state.profile.ContactNo === null || this.state.profile.ContactNo === undefined ? "" : `${this.state.profile.ContactNo}`}
                <br />
                <br />

                <b>City: </b>
                {this.state.profile.City === null || this.state.profile.City === undefined ? "" : `${this.state.profile.City}`}

                <br />
                <br />
                <b>Country: </b>
                {this.state.profile.Country === null || this.state.profile.Country === undefined ? "" : `${this.state.profile.Country}`}
                <br />
                <br />

                <b>Company: </b>
                {this.state.profile.Company === null || this.state.profile.Company === undefined ? "" : `${this.state.profile.Company}`}
                <br />
                <br />

                <b>School: </b>
                {this.state.profile.School === null || this.state.profile.School === undefined ? "" : `${this.state.profile.School}`}
                <br />
                <br />

                <b>Hometown: </b>
                {this.state.profile.Hometown === null || this.state.profile.Hometown === undefined ? "" : `${this.state.profile.Hometown}`}
                <br />
                <br />

                <b>Languages: </b>
                {this.state.profile.Languages === null || this.state.profile.Languages === undefined ? "" : `${this.state.profile.Languages}`}
              </div>
              <div className="col" style={{ textAlign: "right", position: "auto" }}>
                {/* Simply textAlign: "right" doesnt work to align button at the right, we also also to set position as auto */}
                <Button type="primary" size="large" icon="edit" onClick={this.handleModalShow}>
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Show a modal if showModal state is true, else dont show */}
            <Modal show={this.state.showModal} onHide={this.handleModalClose}>
              <Modal.Header closeButton>
                <Modal.Title className="px-4">Enter details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Edit />
              </Modal.Body>
            </Modal>
          </Content>
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loginRequest, editRequest } = state;
  return { loginRequest, editRequest };
}

export default connect(mapStateToProps)(Profile);
