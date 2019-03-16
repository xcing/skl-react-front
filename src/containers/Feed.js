import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./css/Feed.css";

class Feed extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <React.Fragment>
        Feed
      </React.Fragment>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    user: state.user
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     fetchData: data => dispatch(addAllUserData(data))
//   };
// };

export default connect(
  mapStateToProps
  //   mapDispatchToProps
)(Feed);
