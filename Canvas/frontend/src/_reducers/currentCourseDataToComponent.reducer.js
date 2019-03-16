import { CURRENT_COURSE_DATA_TO_COMPONENT } from "../_actions/types";

const initialState = {
  currentCourse: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CURRENT_COURSE_DATA_TO_COMPONENT:
      return {
        ...state,
        currentCourse: action.payload
      }; // Return a new state - This state is assigned all the props of the previos state (initialState) and the response is overwritten - Just like Object.assign()

    default:
      return state;
  }
}
