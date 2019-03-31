// To persist state on page refresh/rerender - https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage

export const loadState = () => {
  // NOTE This is how we export when we will be destructuring whereever we will be usin this - THis is not default export therefore it will not be exported without the use of destructuring
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  // NOTE This is how we export when we will be destructuring whereever we will be usin this - THis is not default export therefore it will not be exported without the use of destructuring
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    // Ignore write errors
  }
};
