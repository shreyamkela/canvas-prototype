import React, { Component } from "react";

import { connect } from "react-redux";

import { Layout } from "antd";

class Inbox extends Component {
  render() {
    const { Header, Content, Footer } = Layout;

    return (
      <div>
        {/* FIXME Make the create page a modal */}
        <Layout style={{ marginLeft: 150 }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              minHeight: 560
            }}
          >
            Inbox
          </Content>
          <Footer style={{ background: "#fff" }} />
        </Layout>
      </div>
    );
  }
}

export default connect(null)(Inbox);
