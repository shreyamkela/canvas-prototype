import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import axios from "axios";

class Assignment extends Component {
  render() {
    return <div>Assignments</div>;
  }
}

export default connect(null)(Assignment);
