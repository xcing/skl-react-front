import React, { Component } from "react";
import Header from "../containers/Header";

export default class NotFound extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <React.Fragment>
        <Header />
        <div>Not Found</div>
      </React.Fragment>
    );
  }
}
