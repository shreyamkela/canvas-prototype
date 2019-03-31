// Only visible to the student
import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import axios from "axios";

class Grades extends Component {
  render() {
    return <div>Grades</div>;
  }
}

export default connect(null)(Grades);
