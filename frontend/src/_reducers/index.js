import { combineReducers } from "redux";
import loginRequestReducer from "./loginRequest.reducer";
import registrationRequestReducer from "./registrationRequest.reducer";
import createRequestReducer from "./createRequest.reducer";
import courseDataToComponentReducer from "./courseDataToComponent.reducer";
import currentCourseDataToComponentReducer from "./currentCourseDataToComponent.reducer";
import announcementCreateRequestReducer from "./announcementCreateRequest.reducer";

export default combineReducers({
  loginRequest: loginRequestReducer,
  registrationRequest: registrationRequestReducer,
  createRequest: createRequestReducer,
  courseDataToComponent: courseDataToComponentReducer,
  announcementCreateRequest: announcementCreateRequestReducer,
  currentCourseDataToComponent: currentCourseDataToComponentReducer
});
