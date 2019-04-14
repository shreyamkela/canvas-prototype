import React, { Component } from "react";
import { connect } from "react-redux"; // Connects the components to the redux store
import API from "../../../_helpers/API";

class People extends Component {
  // ANCHOR 1
  state = {
    people: ""
  };

  handleRemoveStudent = async email => {
    const { currentCourseDataToComponent } = this.props;
    const data = {
      email: email,
      courseId: currentCourseDataToComponent.currentCourse.Id
    };

    try {
      await API.post("people", { data });
    } catch (error) {
      console.log(error.response);
    }
  };

  async componentDidMount() {
    const { loginRequest, currentCourseDataToComponent } = this.props;
    const data = {
      courseId: currentCourseDataToComponent.currentCourse.Id
    };

    try {
      let response = await API.get("people", { params: data });

      let allPeople = (
        <React.Fragment>
          <table>
            <tr>
              <th>Email</th>
              <th />
            </tr>

            {Object.keys(response.data).map(key => (
              <tr>
                <td>{response.data[key].email}</td>
                <td>
                  {loginRequest.persona == 1 ? (
                    <button type="button" className="btn btn-success btn-sm m-2" onClick={this.handleRemoveStudent(response.data[key].email)}>
                      Remove
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </table>
        </React.Fragment>
      );
      this.setState({ grades: allPeople });
    } catch (error) {
      console.log(error.response);
    }
  }

  render() {
    return <div>{this.state.people}</div>;
  }
}

function mapStateToProps(state) {
  const { loginRequest, currentCourseDataToComponent } = state;
  return { loginRequest, currentCourseDataToComponent };
}
// ANCHOR 2

export default connect(mapStateToProps)(People);
