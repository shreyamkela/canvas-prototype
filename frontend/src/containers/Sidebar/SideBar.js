import React, { Component } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import cookie from "react-cookies";

import { Layout, Menu, Icon, Drawer, Button } from "antd";

class SideBar extends Component {
  state = { accountDrawerVisible: false, coursesDrawerVisible: false };

  showAccountDrawer = () => {
    this.setState({
      accountDrawerVisible: true
    });
  };

  showCoursesDrawer = () => {
    this.setState({
      coursesDrawerVisible: true
    });
  };

  onClose = () => {
    this.setState({
      accountDrawerVisible: false,
      coursesDrawerVisible: false
    });
  };

  handleLogOut = () => {
    console.log("Log Out Clicked!");
  };

  render() {
    console.log("Home Page Reached!");
    //if not logged in go to login page:
    // At the server end, we use res.cookie command of the express-session library, to set the name 'cookie' to the cookie sent to client, when admin logs in. At react/client end, we can check whether the name is 'cookie' or not, to authenticate.
    // At react/client end, we check the cookie name using cookie.load('cookie') command of the 'react-cookies' library. If cookie.load('cookie') != null this means that the user is admin
    // https://stackoverflow.com/questions/44107665/how-to-access-a-browser-cookie-in-a-react-app
    console.log(cookie.load("cookie"));
    if (!cookie.load("cookie")) {
      console.log("Redirecting to Login...");
      return <Redirect to="/" />;
    } else {
      console.log("Staying on Home...");
      const { Header, Content, Footer, Sider } = Layout;
      return (
        <div>
          <Layout>
            <Sider
              style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0
              }}
              width="150"
              collapsible
            >
              <div className="logo" />
              <Menu theme="dark" mode="inline">
                <Menu.Item key="1" onClick={this.showAccountDrawer}>
                  <Icon type="user" />
                  <span className="nav-text">
                    <Link to="#">
                      {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                      <font size="2">Account</font>
                    </Link>
                  </span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="dashboard" />
                  <span className="nav-text">
                    <Link to="/home">
                      {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                      <font size="2">Dashboard</font>
                    </Link>
                  </span>
                </Menu.Item>
                <Menu.Item key="3" onClick={this.showCoursesDrawer}>
                  <Icon type="book" />
                  <span className="nav-text">
                    <Link to="#">
                      {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                      <font size="2">Courses</font>
                    </Link>
                  </span>
                </Menu.Item>
              </Menu>
            </Sider>
            {/* FIXME Move the drawer after the sider */}
            <Drawer
              title="Account"
              placement="left"
              style={{ textAlign: "center" }}
              width={300}
              onClose={this.onClose}
              visible={this.state.accountDrawerVisible}
            >
              <Link to="/profile" style={{ textDecoration: "underline" }} onClick={this.onClose}>
                {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                <font size="4">Profile</font>
              </Link>

              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  borderTop: "1px solid #e9e9e9",
                  padding: "10px 16px",
                  background: "#fff",
                  textAlign: "center"
                }}
              >
                <Button type="primary" onClick={this.handleLogOut}>
                  Log Out
                </Button>
              </div>
            </Drawer>
            <Drawer
              title="Courses"
              placement="left"
              style={{ textAlign: "center" }}
              width={300}
              onClose={this.onClose}
              visible={this.state.coursesDrawerVisible}
            >
              <Link to="/courses" style={{ textDecoration: "underline" }} onClick={this.onClose}>
                {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                <font size="4">Courses</font>
              </Link>
            </Drawer>
          </Layout>
        </div>
      );
    }
  }
}

export default SideBar;
