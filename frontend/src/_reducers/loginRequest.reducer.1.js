import { LOGIN_REQUEST } from "../_actions/types";

const initialState = {
  response: "",
  persona: 0,
  email: ""
};

export default function(state = initialState, action) {
  //console.log("Login Request Reducer Called! Payload: ", action.payload);
  switch (action.type) {
    case LOGIN_REQUEST:
      let currentPersona = null;
      let currentPayload = action.payload;
      if (currentPayload.includes("Faculty")) {
        currentPersona = 1;
      } else if (currentPayload.includes("Student")) {
        currentPersona = 2;
      }

      return {
        ...state,
        response: action.payload,
        persona: currentPersona,
        email: action.email
      }; // Return a new state - This state is assigned all the props of the previos state (initialState) and the response is overwritten - Just like Object.assign()
    default:
      //console.log("Login Request Reducer default set!");
      return state;
  }
}
