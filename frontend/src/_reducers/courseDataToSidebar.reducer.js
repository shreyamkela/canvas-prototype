import { COURSE_DATA_TO_SIDEBAR } from "../_actions/types";

const initialState = {
  courses: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case COURSE_DATA_TO_SIDEBAR:
      return {
        ...state,
        courses: action.payload
      }; // Return a new state - This state is assigned all the props of the previos state (initialState) and the response is overwritten - Just like Object.assign()

    default:
      return state;
  }
}
