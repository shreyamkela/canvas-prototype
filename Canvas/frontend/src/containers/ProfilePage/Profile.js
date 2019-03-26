import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { Layout } from "antd";
import { Button, Modal, Collapse } from "antd";

import Avatar from "./Avatar";

class Profile extends Component {
  async componentDidMount() {
    // Fetching the full name. Also any profile details if submitted previously
    const { loginRequest } = this.props; // redux state to props
    const data = { email: loginRequest.email };
    try {
      let response = await axios.get("http://localhost:3001/getprofile", { params: data });
      this.setState({ profile: response.data });
    } catch (error) {
      console.log(error.response);
    }
  }

  render() {
    const { Header, Content, Footer, Sider } = Layout;
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
              <div className="col" />
              <div className="col" style={{ marginLeft: 700 }}>
                <Button type="primary" size="large" icon="edit" onClick={this.showModal}>
                  Edit Profile
                </Button>
              </div>
            </div>
            Content
            <Avatar />
          </Content>
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(Profile);
