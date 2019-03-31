import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import axios from "axios";

class People extends Component {
  render() {
    return <div>People</div>;
  }
}

export default connect(null)(People);
