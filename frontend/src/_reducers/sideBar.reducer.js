import { SHOW_PROFILE, SHOW_DASHBOARD, SHOW_COURSES } from "../_actions/types";

const initialState = {
  profileVisible: false,
  dashboardVisible: true,
  coursesVisible: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_PROFILE:
      return {
        ...state,
        profileVisible: true,
        dashboardVisible: false,
        coursesVisible: false
      }; // Return a new state - This state is assigned all the props of the previos state (initialState) and the response is overwritten - Just like Object.assign()

    case SHOW_DASHBOARD:
      return {
        ...state,
        profileVisible: false,
        dashboardVisible: true,
        coursesVisible: false
      }; // Return a new state - This state is assigned all the props of the previos state (initialState) and the response is overwritten - Just like Object.assign()

    case SHOW_COURSES:
      return {
        ...state,
        profileVisible: false,
        dashboardVisible: false,
        coursesVisible: true
      }; // Return a new state - This state is assigned all the props of the previos state (initialState) and the response is overwritten - Just like Object.assign()

    default:
      return state;
  }
}
