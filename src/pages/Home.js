import React, { Component } from "react";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./css/Home.css";

const cookies = new Cookies();

export const addAllUserData = data => ({
  type: "ADD_ALL_USER_DATA",
  data: data
});

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      name: '',
      categoryId: '',
      startTime: '',
      endTime: ''
    };

    if (cookies.get("accessToken") == null) {
      this.state.redirect = true;
    }
  }

  componentDidMount() {
    if (this.props.user == null && cookies.get("accessToken") != null) {
      this.getUserData();
    }
  }

  processResponse(response) {
    return Promise.all([response.status, response.json()]).then(res => ({
      statusCode: res[0],
      data: res[1]
    }));
  }

  getUserData() {
    fetch(process.env.REACT_APP_REST_API_LOCATION + "/api/auth/user", {
      method: "GET",
      headers: {
        Authorization: cookies.get("accessToken")
      }
    })
      .then(this.processResponse)
      .then(res => {
        if (res.statusCode !== 200) {
          console.log(res.data.message);
        } else {
          this.props.fetchData(res.data);
        }
      })
      .catch(error => {
        console.error(error);
        return { name: "network error", description: "" };
      });
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    // fetch(process.env.REACT_APP_REST_API_LOCATION+"/api/auth/login", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "X-Requested-With": "XMLHttpRequest"
    //   },
    //   dataType: "json",
    //   body: JSON.stringify(this.state)
    // })
    //   .then(this.processResponse)
    //   .then(res => {
    //     if (res.statusCode !== 200) {
    //       console.log(res.data.message);
    //     } else {
    //       // console.log(res.data);
    //       cookies.set("accessToken", "Bearer "+res.data.access_token, { path: "/" });
    //       this.getUserData();
    //     }
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     return { name: "network error", description: "" };
    //   });
  };

  render() {
    const { redirect } = this.state;
    if (redirect && window.location.pathname !== "/login") {
      return <Redirect to="/login" />;
    }

    return (
      <React.Fragment>
        <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="name" bsSize="large">
            <ControlLabel>Name</ControlLabel>
            <FormControl
              autoFocus
              type="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="categoryId" bsSize="large">
            <ControlLabel>Category</ControlLabel>
            <FormControl
              value={this.state.categoryId}
              onChange={this.handleChange}
              type="categoryId"
            />
          </FormGroup>
          <Button
            block
            bsStyle="success"
            bsSize="large"
            type="submit"
          >
            Search
          </Button>
        </form>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: data => dispatch(addAllUserData(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
