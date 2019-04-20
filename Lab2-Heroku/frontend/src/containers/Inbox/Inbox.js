import React, { Component } from "react";
import { connect } from "react-redux";
// import InfiniteScroll from "react-infinite-scroller";

import { Layout, List, message, Spin, Cascader, Button, Modal, Collapse } from "antd";
import { Form, Col } from "react-bootstrap"; // for the new user modal

import API from "../../_helpers/API";

class Inbox extends Component {
  state = {
    data: "",
    recipent: "",
    allRecipents: "",
    loading: false,
    hasMore: true,
    visible: false,
    validated: false,
    redirect: false,
    alert: ""
  };

  async componentDidMount() {
    const { loginRequest } = this.props; // redux state to props
    const data = { email: loginRequest.email, fetchingType: "messages" };

    try {
      let response = await API.get("messages", { params: data });
      this.setState({ data: response.data });
    } catch (error) {
      console.log(error.response);
    }
  }

  handleInfiniteOnLoad = async () => {
    let messages = this.state.data;
    this.setState({
      loading: true
    });
    if (messages.length > 14) {
      message.warning("Infinite List loaded all");
      this.setState({
        hasMore: false,
        loading: false
      });
      return;
    }
    const { loginRequest } = this.props; // redux state to props
    const data = { email: loginRequest.email };
    try {
      let response = await API.get("messages", { params: data });
      messages = messages.concat(response.data);
      this.setState({ data: response.data, loading: false });
    } catch (error) {
      console.log(error.response);
    }
  };

  showModal = async () => {
    const { loginRequest } = this.props; // redux state to props
    const data = { email: loginRequest.email, fetchingType: "recipents" };

    try {
      let response = await API.get("messages", { params: data });
      this.setState({ allRecipents: response.data, visible: true });
    } catch (error) {
      console.log(error.response);
    }
  };

  handleOk = async e => {
    const { loginRequest } = this.props; // redux state to props
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault(); // dont do default - default is submitting the data to the database
      e.stopPropagation(); // dont propogate event to parents
    } else if (this.refs.title.value != "" && this.refs.desc.value != "") {
      // Only dispatch when both fields are non empty
      let data = {
        title: this.refs.title.value,
        message: this.refs.message.value,
        email: loginRequest.email,
        recipent: this.state.recipent
      };
      try {
        let response = await API.post("messages", { data });
        this.setState({ redirect: true });
      } catch (error) {
        console.log(error.response);
      }

      this.setState({ redirect: true, alert: "Message sent successfully!" });
    }
    this.setState({ validated: true });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  onChange = value => {
    console.log(value);
    this.setState({ recipent: value });
  };

  reverseObject = Obj => {
    // To reverse the allMessages object
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
    const { Header, Content, Footer } = Layout;
    const { validated } = this.state; // form validations

    const allRecipents = null;
    Object.keys(this.state.allRecipents).map(key => {
      allRecipents = { value: key.courseName, label: key.courseName, children: key.users };
    });

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
            <div style={{ textAlign: "right", marginRight: 20 }}>
              <Button type="primary" shape="round" size="large" icon="plus" onClick={this.showModal}>
                Message
              </Button>
            </div>
            <Layout>
              <div className="demo-infinite-container" style={{ width: 300 }}>
                {/* <InfiniteScroll
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
                        <List.Item.Meta
                          title={
                            <a href="#" onClick={this.handleTitleClick}>
                              {item.title}
                            </a>
                          }
                        />
                      </List.Item>
                    )}
                  >
                    {this.state.loading && this.state.hasMore && (
                      <div className="demo-loading-container">
                        <Spin />
                      </div>
                    )}
                  </List>
                </InfiniteScroll> */}
              </div>
            </Layout>
          </Content>
          <Footer style={{ background: "#fff" }} />
        </Layout>
        <Modal title="Send a message:" visible={this.state.visible} onOk={e => this.handleOk(e)} onCancel={this.handleCancel}>
          <Form noValidate validated={validated}>
            {/* FIXME Fix the size of the text boxes. Also, description feild should be a text area */}
            <Form.Group as={Col} controlId="validationTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control required type="text" placeholder="Enter Title" ref="title" />
            </Form.Group>
            <Form.Group as={Col} controlId="validationMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control required as="textarea" rows="3" placeholder="Enter Message" ref="message" />
            </Form.Group>
            <Cascader options={allRecipents} onChange={this.onChange} placeholder="Please select" />
          </Form>
          <div className="text-success">{this.state.alert}</div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loginRequest } = state;
  return { loginRequest };
}

export default connect(mapStateToProps)(Inbox);
