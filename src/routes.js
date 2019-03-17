import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

class Routes extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default Routes;
