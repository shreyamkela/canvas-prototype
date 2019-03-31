import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import axios from "axios";

class Files extends Component {
  render() {
    return <div>Files</div>;
  }
}

export default connect(null)(Files);
