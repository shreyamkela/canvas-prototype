import { LOGIN_REQUEST } from "../_actions/types";

const initialState = {
  response: ""
};

export default function(state = initialState, action) {
  console.log("Login Request Reducer Called! Payload: ", action.payload);
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        response: action.payload
      }; // Return a new state - This state is assigned all the props of the previos state (initialState) and the response is overwritten - Just like Object.assign()
    default:
      //console.log("Login Request Reducer default set!");
      return state;
  }
}
