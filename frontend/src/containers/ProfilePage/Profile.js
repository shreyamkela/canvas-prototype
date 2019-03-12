import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import cookie from "react-cookies";
import { Redirect } from "react-router";

import { Layout } from "antd";

import SideBar from "../Sidebar/SideBar";

class Profile extends Component {
  render() {
    console.log("Profile Page Reached!");
    //if not logged in go to login page:
    // At the server end, we use res.cookie command of the express-session library, to set the name 'cookie' to the cookie sent to client, when admin logs in. At react/client end, we can check whether the name is 'cookie' or not, to authenticate.
    // At react/client end, we check the cookie name using cookie.load('cookie') command of the 'react-cookies' library. If cookie.load('cookie') != null this means that the user is admin
    // https://stackoverflow.com/questions/44107665/how-to-access-a-browser-cookie-in-a-react-app
    const { showProfile } = this.props; // redux state to props
    console.log("ShowProfile:", this.props.showProfile.visible);

    console.log(cookie.load("cookie"));
    if (!cookie.load("cookie")) {
      // FIXME We have to include these if else conditions in each an every page to check if the user is logged in. Is there a better way do do this validation so that code is reduced?
      console.log("Redirecting to Login...");
      return <Redirect to="/" />;
    } else if (this.props.showProfile.visible == true) {
      const { Header, Content, Footer, Sider } = Layout;
      return (
        <div>
          <Layout>
            <SideBar />
          </Layout>
          <Layout style={{ marginLeft: 150 }}>profile</Layout>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  const { showProfile } = state;
  return { showProfile };
}

export default connect(mapStateToProps)(Profile);
