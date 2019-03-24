// Home page is the dashboard page

import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { Typography, Layout, Input, Radio } from "antd";

import SideBar from "../Sidebar/SideBar";

class Enroll extends Component {
  state = {
    validated: false,
    courseErrorMessage: "",
    filterPresent: true,
    filterRadioValue: 1,
    searchByRadioValue: "id",
    courses: ""
  };

  async handleSearch(searchValue) {
    // NOTE using arrow function with async keyword shows error or async keyword
    console.log("Search term:", searchValue);
    console.log("Filter Radio:", this.state.filterRadioValue);
    console.log("Search By Radio:", this.state.searchByRadioValue);
    if (searchValue !== "") {
      const data = { searchValue: searchValue, filterRadioValue: this.state.filterRadioValue, searchByRadioValue: this.state.searchByRadioValue };

      try {
        let response = await axios.get("http://localhost:3001/searchcourses", { params: data });
        this.setState({ courses: response.data });
      } catch (error) {
        console.log(error.response);
      }
    }
  }

  onChange = e => {
    // For radio buttons
    //console.log(`radio checked:${e.target.value}`);
    if (e.target.value !== "id") {
      // If course Id button is not selected, then remove the filter
      this.setState({ filterPresent: false, searchByRadioValue: e.target.value, filterRadioValue: 0 });
    } else if (e.target.value === "id" && this.state.filterPresent === false) {
      // If any other button was clicked and course id is clicked again
      this.setState({ filterPresent: true, searchByRadioValue: e.target.value, filterRadioValue: 1 });
    }
  };

  onFilterChange = e => {
    // for filter radios
    // console.log(`filter checked:${e.target.value}`);
    this.setState({
      filterRadioValue: e.target.value
    });
  };

  render() {
    const { validated } = this.state;

    const { createRequest } = this.props;
    //console.log("createRequest: ", createRequest);

    const { Header, Content, Footer } = Layout;
    const { Title } = Typography;
    const Search = Input.Search;
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;

    let filter = null;
    if (this.state.filterPresent === true) {
      filter = (
        <div>
          <font className="font-weight-bold" size="3">
            Filter:
          </font>
          <br />
          <RadioGroup onChange={this.onFilterChange} value={this.state.filterRadioValue}>
            <Radio value={1}>Exact</Radio>
            <Radio value={2}>Greater than</Radio>
            <Radio value={3}>Less than</Radio>
          </RadioGroup>
        </div>
      );
    }

    let coursesSearched = null;
    if (this.state.courses === "noCourses") {
      coursesSearched = (
        <font className="font-weight-bold" size="3">
          No courses available{/**If no courses present */}
        </font>
      );
    } else if (this.state.courses.length > 0) {
      // there is something other than noCourses
      console.log("XXXXXXXXXXXXXXXXXXXXXXXXX", this.state.courses);
      coursesSearched = (
        <React.Fragment>
          {Object.keys(this.state.courses).map(key => (
            <font size="4" key={key}>
              {this.state.courses[key].Id}
            </font>
          ))}
        </React.Fragment>
      );
    }

    return (
      <div>
        <Layout>
          <SideBar />
        </Layout>
        {/* FIXME Make the create page a modal */}
        <Layout style={{ marginLeft: 150 }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              minHeight: 470
            }}
          >
            <Title>Enroll into a Course:</Title>

            <Search
              placeholder="Search for a course by id, term, or course name"
              enterButton="Search"
              size="large"
              onSearch={searchValue => this.handleSearch(searchValue)}
              style={{ width: 700 }}
            />
            <br />
            <br />
            <div>
              <font className="font-weight-bold" size="3">
                Search by:
              </font>
              <br />
              <Radio.Group onChange={this.onChange} defaultValue="id" buttonStyle="solid" size="large" style={{ marginRight: 10 }}>
                <Radio.Button value="id">Course Id</Radio.Button>
                <Radio.Button value="term">Term</Radio.Button>
                <Radio.Button value="name">Course Name</Radio.Button>
              </Radio.Group>

              <br />
              <br />
              {filter}
            </div>
            <div>{coursesSearched}</div>

            <div className="d-flex flex-column mb-4">
              {/* <div className="personaErrorMessage text-danger">{this.state.personaErrorMessage}</div> */}
            </div>
            <div className="text-success">{createRequest.response}</div>
          </Content>
          <Footer style={{ background: "#fff" }} />
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { createRequest, loginRequest } = state;
  return { createRequest, loginRequest };
}

export default connect(mapStateToProps)(Enroll);
