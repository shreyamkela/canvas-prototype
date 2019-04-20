// Home page is the dashboard page

import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { Typography, Layout, Input, Radio, message, Pagination } from "antd";
import API from "../../_helpers/API";

class Enroll extends Component {
  state = {
    message: "",
    filterPresent: true,
    filterRadioValue: 1,
    searchByRadioValue: "id",
    courses: "",
    pagenumber: 1
  };

  async handleSearch(searchValue) {
    // NOTE using arrow function with async keyword shows error or async keyword
    // console.log("Search term:", searchValue);
    // console.log("Filter Radio:", this.state.filterRadioValue);
    // console.log("Search By Radio:", this.state.searchByRadioValue);
    if (searchValue !== "") {
      const data = {
        searchValue: searchValue,
        filterRadioValue: this.state.filterRadioValue,
        searchByRadioValue: this.state.searchByRadioValue
      };

      try {
        let response = await API.get("searchcourses", { params: data });
        this.setState({ courses: response.data, pagenumber: 1 });
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

  handleEnroll = async key => {
    console.log("Enroll:", key);
    if (this.state.courses[key].capacity - this.state.courses[key].capacityUsed === 0) {
      message.error("Cannot enroll as the class capacity is full!");
    } else {
      const { loginRequest } = this.props;
      const data = { courseId: this.state.courses[key].courseId, email: loginRequest.email };
      try {
        let response = await API.post("enroll", { data });
        message.success(response.data);
        // Change the count of the capacity used - NOTE Here we are not fetching the courses data again, after the update. We are updating the frontend without requesting any new data from the backend as we know that the database would have been already updated so we can change the count.
        // If the database would not have been updated then then this setState wont run as there must be an error at backend which will be caught by the catch below
        let newCourses = this.state.courses;
        newCourses[key].capacityUsed++;
        this.setState({ courses: newCourses });

        // FIXME dispatch? so that the count is updated on enroll page
      } catch (error) {
        console.log(error.response);
        message.error(error.response.data);
      }
    }
  };

  handleWaitlist = async key => {
    console.log("Waitlist:", key);

    // console.log(
    //   "Waitlist - key, waitlist, used, difference:",
    //   key,
    //   this.state.courses[key].Waitlist,
    //   this.state.courses[key].waitlistUsed,
    //   this.state.courses[key].Waitlist - this.state.courses[key].waitlistUsed
    // );
    if (this.state.courses[key].waitlist - this.state.courses[key].waitlistUsed === 0) {
      message.error("Cannot add to waitlist as the waitlist is full!");
    } else {
      const { loginRequest } = this.props;
      const data = { courseId: this.state.courses[key].courseId, email: loginRequest.email };
      try {
        let response = await API.post("waitlist", { data });
        message.success(response.data);
        // Change the count of the waitlist used - NOTE Here we are not fetching the courses data again, after the update. We are updating the frontend without requesting any new data from the backend as we know that the database would have been already updated so we can change the count.
        // If the database would not have been updated then then this setState wont run as there must be an error at backend which will be caught by the catch below
        let newCourses = this.state.courses;
        newCourses[key].waitlistUsed++;
        this.setState({ courses: newCourses });
        // FIXME dispatch? so that the count is updated on enroll page
        // FIXME send a notification to faculty that waitlists exist
      } catch (error) {
        console.log(error.response);
        message.error(error.response.data);
      }
    }
  };

  handlePageNumberClick = e => {
    console.log("Page number changed!", e);
    this.setState({ pagenumber: e });
  };

  render() {
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

    var pagination = null;
    let allCourses = null;
    let pageCourses = []; // courses to show on this page number
    if (this.state.courses[0] !== undefined) {
      let pageNumbers = Math.floor(this.state.courses.length / 2) + (this.state.courses.length % 2);
      pagination = <Pagination defaultPageSize={1} defaultCurrent={1} total={pageNumbers} onChange={this.handlePageNumberClick} />;
      allCourses = this.state.courses;
      let thisPageLast = this.state.pagenumber * 2;
      for (var i = thisPageLast - 2; i < thisPageLast; i++) {
        if (allCourses[i] !== undefined) {
          pageCourses[i] = allCourses[i];
        }
      }
      //console.log("XXXXXXXXXXXXXXXXXXXXXXX", pageCourses);
    }

    let coursesSearched = null;
    if (this.state.courses === "noCourses" || this.state.courses[0] === undefined) {
      coursesSearched = (
        <font className="font-weight-bold" size="3">
          No courses available{/**If no courses present */}
        </font>
      );
    } else if (this.state.courses.length > 0) {
      // there is something other than noCourses
      coursesSearched = (
        <React.Fragment>
          {Object.keys(pageCourses).map(key => (
            <div key={key}>
              <div className="card" style={{ width: 900 }}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm">
                      <h5 className="card-title">
                        {pageCourses[key].courseId} {pageCourses[key].courseName}
                      </h5>
                    </div>
                    <div className="col-sm" style={{ textAlign: "right" }}>
                      {/* NOTE by specifiying className as button you can make links with <a> tag as a button in bootstrap */}
                      {/* <a href="#" className="btn btn-success">
                        Enroll
                      </a> */}
                      <button
                        type="button"
                        className="btn btn-success btn-sm m-2"
                        onClick={() => {
                          console.log(
                            "XXXXXXXXXXXXXXXXXXXXXXXX",
                            this.state.pagenumber,
                            this.state.pagenumber * 2,
                            this.state.pagenumber * 2 - 2,
                            parseInt(key),
                            this.state.pagenumber * 2 - 2 + parseInt(key),
                            pageCourses
                          );
                          this.handleEnroll(parseInt(key)); // This is how we can pass a variable with onCLick in react. Ifwe dont use the () => then this.handleEnroll becomes a normal function and it will be called as soon a this button is rendered. It wount wait for the click
                        }}
                      >
                        Enroll
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm m-2"
                        onClick={() => {
                          this.handleWaitlist(parseInt(key));
                        }}
                      >
                        Waitlist
                      </button>
                    </div>
                  </div>

                  <div className="row" style={{ marginLeft: 1 }}>
                    <p className="card-text mr-4">
                      <b>Total capacity: {pageCourses[key].capacity}</b>
                    </p>
                    <p className="card-text mx-4">
                      <b>Capacity Left: {pageCourses[key].capacity - pageCourses[key].capacityUsed}</b>
                    </p>
                    <p className="card-text mx-4">
                      <b>Total waitlist: {pageCourses[key].waitlist}</b>
                    </p>
                    <p className="card-text mx-4">
                      <b>Waitlist Left: {pageCourses[key].waitlist - pageCourses[key].waitlistUsed}</b>
                    </p>
                  </div>
                  <p className="card-text">{pageCourses[key].description}</p>
                </div>
              </div>
              <br />
            </div>
          ))}
        </React.Fragment>
      );
    }

    return (
      <div>
        {/* FIXME Make the create page a modal */}
        <Layout style={{ marginLeft: 150, minHeight: 560 }}>
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
            <br />

            <br />

            <div>{coursesSearched}</div>
            {pagination}
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

export default connect(mapStateToProps)(Enroll);
