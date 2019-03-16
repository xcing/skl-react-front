import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import Cookies from "universal-cookie";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./css/Header.css";

const cookies = new Cookies();

export const addAllUserData = data => ({
  type: "ADD_ALL_USER_DATA",
  data: data
});

class Header extends Component {
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
          this.props.fetchData(res.data.data);
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
          // cookies.remove("accessToken", { path: "/" });
        } else {
          cookies.set("accessToken", "Bearer "+res.data.access_token, { path: "/" });
          this.props.fetchData(res.data.data);
          this.setState({ redirect: true });
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
        <div className="Header">
          <div className="container">
            <div className="left">
              <Link to="/">Gankup</Link>
            </div>
            <div className="left margin-left">
              <Link to="/register">
                <Button block bsStyle="success" bsSize="sm" type="button">
                  Register
                </Button>
              </Link>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="right margin-left">
                <Button block bsStyle="primary" bsSize="sm" type="submit">
                  Login
                </Button>
              </div>
              <div className="right margin-left">
                <FormGroup controlId="password" bsSize="sm">
                  <FormControl
                    bsStyle="sm"
                    bsSize="sm"
                    value={this.state.password}
                    placeholder="Password"
                    onChange={this.handleChange}
                    type="password"
                  />
                </FormGroup>
              </div>
              <div className="right">
                <FormGroup controlId="email" bsSize="sm">
                  <FormControl
                    bsStyle="sm"
                    bsSize="sm"
                    value={this.state.email}
                    placeholder="Email"
                    onChange={this.handleChange}
                    type="email"
                  />
                </FormGroup>
              </div>
            </form>
          </div>
        </div>
        <div className="header-block" />
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
)(Header);
