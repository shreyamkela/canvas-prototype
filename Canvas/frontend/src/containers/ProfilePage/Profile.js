import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";

import { Layout } from "antd";

import SideBar from "../Sidebar/SideBar";
import Avatar from "./Avatar";

class Profile extends Component {
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
            Content
            <Avatar />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default Profile;
