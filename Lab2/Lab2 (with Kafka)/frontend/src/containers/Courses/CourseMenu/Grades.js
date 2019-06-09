// Only visible to the student
import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import API from "../../../_helpers/API";

class Grades extends Component {
  // ANCHOR 1

  state = {
    grades: ""
  };
  async componentDidMount() {
    const { loginRequest, currentCourseDataToComponent } = this.props;
    const data = {
      email: loginRequest.email,
      courseId: currentCourseDataToComponent.currentCourse.Id
    };

    try {
      let response = await API.get("grade", { params: data });
      let allGrades = (
        <React.Fragment>
          <table>
            <tr>
              <th>Submission</th>
              <th>Grade</th>
            </tr>

            {Object.keys(response.data).map(key => (
              <tr>
                <td>{response.data[key].name}</td>
                <td>{response.data[key].grade}</td>
              </tr>
            ))}
            {/* <tr>
              <th>Overall</th>
              <th>{response.data.total}</th>
            </tr> */}
          </table>
        </React.Fragment>
      );
      this.setState({ grades: allGrades });
    } catch (error) {
      console.log(error.response);
    }
  }

  render() {
    return <div>{this.state.grades}</div>;
  }
}

function mapStateToProps(state) {
  const { loginRequest, currentCourseDataToComponent } = state;
  return { loginRequest, currentCourseDataToComponent };
}

// ANCHOR 2

export default connect(mapStateToProps)(Grades);
