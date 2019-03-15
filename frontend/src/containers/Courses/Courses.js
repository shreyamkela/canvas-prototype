// Home page is the dashboard page

import React, { Component } from "react";
import { Redirect } from "react-router";
import cookie from "react-cookies";
import { connect } from "react-redux";

import { Layout, Menu, Icon, Drawer, Button } from "antd";

import CourseMenu from "./CourseMenu";

class Courses extends Component {
  handleLogOut = () => {
    // FIXME Handle logout with state? So that we dont have to include handleLogOut() into each and every page code
    console.log("Log Out Clicked!");
  };

  render() {
    const { id } = this.props.match.params; // Course Id passed through :id while routing to this page

    console.log("Staying on Courses...");
    const { Header, Content, Footer, Sider } = Layout;
    return (
      <div>
        <Layout style={{ marginLeft: 150 }}>
          <CourseMenu />

          <Layout>
            <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>COURSE TITLE</Header>
            <Content
              style={{
                background: "#fff",
                minHeight: 470
              }}
            >
              <div>Location</div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { courseDataToSidebar } = state;
  return { courseDataToSidebar };
}

export default connect(mapStateToProps)(Courses);
