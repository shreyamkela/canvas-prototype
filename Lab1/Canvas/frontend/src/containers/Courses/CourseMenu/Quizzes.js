import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import axios from "axios";

class Quizzes extends Component {
  render() {
    return <div>Quizzes</div>;
  }
}

export default connect(null)(Quizzes);
