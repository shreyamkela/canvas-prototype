import { combineReducers } from "redux";
import loginRequestReducer from "./loginRequest.reducer";
import registrationRequestReducer from "./registrationRequest.reducer";
import sideBarReducer from "./sideBar.reducer";

export default combineReducers({
  loginRequest: loginRequestReducer,
  registrationRequest: registrationRequestReducer,
  sideBar: sideBarReducer
});
