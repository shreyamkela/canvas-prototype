import React, { Component } from "react";

import { connect } from "react-redux";

import { Layout, List, message, Avatar, Spin } from "antd";
import reqwest from "reqwest";
import InfiniteScroll from "react-infinite-scroller";

const fakeDataUrl = "https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo";

class Inbox extends Component {
  state = {
    data: [],
    loading: false,
    hasMore: true
  };
  componentDidMount() {
    this.fetchData(res => {
      this.setState({
        data: res.results
      });
    });
  }

  fetchData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: "json",
      method: "get",
      contentType: "application/json",
      success: res => {
        callback(res);
      }
    });
  };

  handleInfiniteOnLoad = () => {
    let data = this.state.data;
    this.setState({
      loading: true
    });
    if (data.length > 14) {
      message.warning("Infinite List loaded all");
      this.setState({
        hasMore: false,
        loading: false
      });
      return;
    }
    this.fetchData(res => {
      data = data.concat(res.results);
      this.setState({
        data,
        loading: false
      });
    });
  };

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
            <Layout>
              <div className="demo-infinite-container" style={{ width: 300 }}>
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteOnLoad}
                  hasMore={!this.state.loading && this.state.hasMore}
                  useWindow={false}
                >
                  <List
                    dataSource={this.state.data}
                    renderItem={item => (
                      <List.Item key={item.id}>
                        <List.Item.Meta title={<a href="https://ant.design">{item.name.last}</a>} description={item.email} />
                        <div>Content</div>
                      </List.Item>
                    )}
                  >
                    {this.state.loading && this.state.hasMore && (
                      <div className="demo-loading-container">
                        <Spin />
                      </div>
                    )}
                  </List>
                </InfiniteScroll>
              </div>
            </Layout>
          </Content>
          <Footer style={{ background: "#fff" }} />
        </Layout>
      </div>
    );
  }
}

export default connect(null)(Inbox);
