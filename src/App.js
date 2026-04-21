import React, { Component, lazy, Suspense } from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import Tracker from "./tracker"; // SATYAJIT

//import AdminLayout from './components/admin/layout/Layout';

import { createBrowserHistory } from "history";

const history = createBrowserHistory();

var path = require("path");
var UrlPattern = require("url-pattern");

const AdminComponent = lazy(() =>
  import(/* webpackChunkName: "admin-module" */ "./routes/Admin")
);

const WaitingComponent = (Component) => {
  return (props) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrapper" style={{ height: "auto" }}>
        <Switch>
          <Route path="/" component={WaitingComponent(AdminComponent)} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
