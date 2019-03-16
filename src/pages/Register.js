import React, { Component } from "react";
import { Button, FormGroup, FormControl, HelpBlock } from "react-bootstrap";
import "./css/Register.css";
import Header from "../containers/Header";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      regisEmail: "",
      regisPassword: "",
      passwordConfirmation: "",
      validationState: null,
      emailErrorMsg: null
    };
  }

  validateForm() {
    return (
      this.state.name.length > 0 &&
      this.state.regisEmail.length > 0 &&
      this.state.regisPassword.length > 0 &&
      this.state.passwordConfirmation.length > 0 &&
      this.state.regisPassword === this.state.passwordConfirmation
    );
  }

  processResponse(response) {
    return Promise.all([response.status, response.json()]).then(res => ({
      statusCode: res[0],
      data: res[1]
    }));
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleBlur = event => {
    if (event.target.id === "email") {
      fetch("http://localhost:8000/api/auth/check/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        dataType: "json",
        body: JSON.stringify({ email: this.state.regisEmail })
      })
        .then(this.processResponse)
        .then(res => {
          if (res.statusCode !== 201) {
            this.setState({
              validationState: "error",
              emailErrorMsg: res.data.message.email
            });
          } else {
            this.setState({
              validationState: null,
              emailErrorMsg: null
            });
          }
        })
        .catch(error => {
          console.error(error);
          return { name: "network error", description: "" };
        });
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    fetch("http://localhost:8000/api/auth/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      dataType: "json",
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.regisEmail,
        password: this.state.regisPassword,
        password_confirmation: this.state.passwordConfirmation
      })
    })
      .then(this.processResponse)
      .then(res => {
        console.log(res);
        if (res.statusCode !== 201) {
          console.log("register fail");
        } else {
          console.log("register success");
        }
      })
      .catch(error => {
        console.error(error);
        return { name: "network error", description: "" };
      });
  };

  render() {
    var helpBlockEmail =
      this.state.validationState === "error" ? "show" : "hidden";
    return (
      <React.Fragment>
        <Header />
        <div className="Login">
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="name" bsSize="large">
              <FormControl
                autoFocus
                type="text"
                value={this.state.name}
                placeholder="Name"
                onChange={this.handleChange}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup
              controlId="regisEmail"
              bsSize="large"
              validationState={this.state.validationState}
            >
              <FormControl
                type="email"
                value={this.state.regisEmail}
                placeholder="Email"
                onChange={this.handleChange}
                onBlur={this.handleBlur}
              />
              <FormControl.Feedback />
              <HelpBlock className={helpBlockEmail}>
                {this.state.emailErrorMsg}
              </HelpBlock>
            </FormGroup>
            <FormGroup controlId="regisPassword" bsSize="large">
              <FormControl
                value={this.state.regisPassword}
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
              />
            </FormGroup>
            <FormGroup controlId="passwordConfirmation" bsSize="large">
              <FormControl
                value={this.state.passwordConfirmation}
                placeholder="Confirm Password"
                onChange={this.handleChange}
                type="password"
              />
            </FormGroup>
            <Button
              block
              bsStyle="warning"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
            >
              Register
            </Button>
            <Button block bsStyle="primary" bsSize="large" type="button">
              Facebook Login
            </Button>
            <Button block bsStyle="danger" bsSize="large" type="button">
              Gmail Login
            </Button>
            <Button block bsStyle="success" bsSize="large" type="button">
              LINE Login
            </Button>
          </form>
        </div>
      </React.Fragment>
    );
  }
}
