import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./css/Login.css";

const cookies = new Cookies();

export const addAllUserData = data => ({
  type: "ADD_ALL_USER_DATA",
  data: data
});

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      remember_me: true,
      redirect: false
    };
  }

  componentDidMount() {
    if (this.props.user == null && cookies.get("accessToken") != null) {
      this.getUserData();
    }
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  processResponse(response) {
    return Promise.all([response.status, response.json()]).then(res => ({
      statusCode: res[0],
      data: res[1]
    }));
  }

  getUserData() {
    fetch(process.env.REACT_APP_REST_API_LOCATION+"/api/auth/user", {
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
          this.setState({ redirect: true });
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

    fetch(process.env.REACT_APP_REST_API_LOCATION+"/api/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      dataType: "json",
      body: JSON.stringify(this.state)
    })
      .then(this.processResponse)
      .then(res => {
        if (res.statusCode !== 200) {
          console.log(res.data.message);
        } else {
          // console.log(res.data);
          cookies.set("accessToken", "Bearer "+res.data.access_token, { path: "/" });
          this.getUserData();
        }
      })
      .catch(error => {
        console.error(error);
        return { name: "network error", description: "" };
      });
  };


  render() {
    const { redirect } = this.state;
    if (redirect && window.location.pathname !== "/") {
      return <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        <div className="Login">
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="email" bsSize="large">
              <ControlLabel>Email</ControlLabel>
              <FormControl
                autoFocus
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
              />
            </FormGroup>
            <Button
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
            >
              Login
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
)(Login);
