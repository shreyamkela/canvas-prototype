import { ANNOUNCEMENT_CREATE } from "../_actions/types";

const initialState = {
  response: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ANNOUNCEMENT_CREATE:
      return {
        ...state,
        response: action.payload
      }; // Return a new state - This state is assigned all the props of the previos state (initialState) and the response is overwritten - Just like Object.assign()

    default:
      return state;
  }
}
