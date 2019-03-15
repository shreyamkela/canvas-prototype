import { combineReducers } from "redux";
import loginRequestReducer from "./loginRequest.reducer";
import registrationRequestReducer from "./registrationRequest.reducer";
import createRequestReducer from "./createRequest.reducer";
import courseDataToSidebarReducer from "./courseDataToSidebar.reducer";

export default combineReducers({
  loginRequest: loginRequestReducer,
  registrationRequest: registrationRequestReducer,
  createRequest: createRequestReducer,
  courseDataToSidebar: courseDataToSidebarReducer
});
