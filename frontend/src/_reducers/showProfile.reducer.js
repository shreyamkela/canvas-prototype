import { SHOW_PROFILE } from "../_actions/types";

const initialState = {
  visible: "false"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_PROFILE:
      //console.log("Login Request Reducer Called!");
      return {
        ...state,
        visible: action.payload
      }; // Return a new state - This state is assigned all the props of the previos state (initialState) and the response is overwritten - Just like Object.assign()
    default:
      //console.log("Login Request Reducer default set!");
      return state;
  }
}
