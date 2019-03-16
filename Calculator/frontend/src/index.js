import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css"; // FIXME Is importing bootstrap in index.js causing the porblem of page first showing non-bootstrap buttons for a splitsecond and then instantly changing to the bootstrapped version. Where should we put this import so it is available everywhere?
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
