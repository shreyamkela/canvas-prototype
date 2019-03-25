import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux"; // Glues react and redux together

import store from "./_helpers/store";

import * as serviceWorker from "./serviceWorker";

import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "antd/dist/antd.css";

import App from "./containers/App/App"; // index.js inside App folder in containers folder exports the default method in App.js. Now import App from "./containers/App" statement first looks for index.js inside the App folder and it will see that App.js is exported through index.js of that folder
import Login from "./containers/LoginPage/Login";

ReactDOM.render(
  <Provider store={store}>
    {/* Order of provider and browserrouter doesnt matter.
    Use Browser Router to route to different pages. */}
    <BrowserRouter>
      {/* NOTE Routes can also be switched between each other by using Switch, but in our case it is not working. So we use <div> */}
      <React.Fragment>
        <Route path="/" component={App} />
        {/* Here | is the OR operator which means that App component is for / and /signin route. Example /(home|main) means the same component for /home and /main */}
      </React.Fragment>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
