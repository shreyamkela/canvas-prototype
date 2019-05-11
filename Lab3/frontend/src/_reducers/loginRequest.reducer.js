import { LOGIN_REQUEST } from "../_actions/types";

const initialState = {
  response: "",
  persona: 0,
  email: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      let currentPersona = null;
      let currentPayloadData = action.payload.data;

      if (currentPayloadData.includes("Faculty")) {
        currentPersona = 1;
      } else if (currentPayloadData.includes("Student")) {
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
