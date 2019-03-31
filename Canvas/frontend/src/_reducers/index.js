import { combineReducers } from "redux";
import loginRequestReducer from "./loginRequest.reducer";
import createRequestReducer from "./createRequest.reducer";
import courseDataToComponentReducer from "./courseDataToComponent.reducer";
import currentCourseDataToComponentReducer from "./currentCourseDataToComponent.reducer";
import announcementCreateRequestReducer from "./announcementCreateRequest.reducer";
import registrationRequestReducer from "./registrationRequest.reducer.js";
import editRequestReducer from "./editRequest.reducer.js";
import { LOGOUT_REQUEST } from "../_actions/types";

const appReducer = combineReducers({
  loginRequest: loginRequestReducer,
  createRequest: createRequestReducer,
  courseDataToComponent: courseDataToComponentReducer,
  announcementCreateRequest: announcementCreateRequestReducer,
  currentCourseDataToComponent: currentCourseDataToComponentReducer,
  registrationRequest: registrationRequestReducer,
  editRequest: editRequestReducer
});

export default (state, action) => {
  // If logout is clicked, we use LOGOUT_REQUEST and put state as undefined, else, we use the other reducers
  if (action.type === LOGOUT_REQUEST) {
    // For logout - https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
    state = undefined;
  }

  return appReducer(state, action);
};
