import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux"; // Connects the components to the redux store

import { Layout, Menu } from "antd";

class CourseMenu extends Component {
  render() {
    const { Sider } = Layout;
    return (
      <div>
        <Sider
          theme="light"
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fluid",
            left: 0
          }}
          width="190"
        >
          <div className="logo" />
          <Menu theme="light" mode="inline" style={{ textAlign: "center" }}>
            <Menu.Item key="1">
              <span className="nav-text">
                <Link to="#">
                  {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                  <font size="3">Announcements</font>
                </Link>
              </span>
            </Menu.Item>
            <Menu.Item key="2">
              <span className="nav-text">
                <Link to="#">
                  {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                  <font size="3">Assignments</font>
                </Link>
              </span>
            </Menu.Item>
            <Menu.Item key="3">
              <span className="nav-text">
                <Link to="#">
                  {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                  <font size="3">People</font>
                </Link>
              </span>
            </Menu.Item>
            <Menu.Item key="4">
              <span className="nav-text">
                <Link to="#">
                  {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                  <font size="3">Files</font>
                </Link>
              </span>
            </Menu.Item>
            <Menu.Item key="5">
              <span className="nav-text">
                <Link to="#">
                  {/** NOTE This Link tag is not of html and is the link of react-router-dom. The latter link can be used for routing */}
                  <font size="3">Quizzes</font>
                </Link>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>
      </div>
    );
  }
}

export default connect(null)(CourseMenu);
