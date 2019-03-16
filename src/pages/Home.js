import React, { Component } from "react";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";
import {
  Button,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import "./css/Home.css";
import DateTime from "react-datetime";

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
      name: "",
      category_id: "",
      start_time: "",
      end_time: "",
      categoryData: [
        {
          id: 1,
          name: "Waiting..."
        }
      ]
    };

    if (cookies.get("accessToken") == null) {
      this.state.redirect = true;
    }
  }

  componentDidMount() {
    if (this.props.user == null && cookies.get("accessToken") != null) {
      this.getUserData();
    }

    this.getCategoryData();
  }

  processResponse(response) {
    return Promise.all([response.status, response.json()]).then(res => ({
      statusCode: res[0],
      data: res[1]
    }));
  }

  getCategoryData() {
    fetch(process.env.REACT_APP_REST_API_LOCATION + "/api/category", {
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
          this.setState({ categoryData: res.data.data });
          this.props.fetchData(res.data);
        }
      })
      .catch(error => {
        console.error(error);
        return { name: "network error", description: "" };
      });
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
                placeholder="Name"
                type="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="category_id" bsSize="large">
              <ControlLabel>Category</ControlLabel>
              <FormControl
                componentClass="select"
                value={this.state.category_id}
                onChange={this.handleChange}
              >
                {this.state.categoryData.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </FormControl>
            </FormGroup>
            <ControlLabel>Start DateTime</ControlLabel>
            <DateTime
              locale="th"
              inputProps={{
                id: "start_time",
                onChange: this.handleChange,
                onBlur: this.handleChange,
                autoComplete: "off"
              }}
            />
            <ControlLabel>End DateTime</ControlLabel>
            <DateTime
              locale="th"
              inputProps={{
                id: "end_time",
                onChange: this.handleChange,
                onBlur: this.handleChange,
                autoComplete: "off"
              }}
            />
            <br />
            <Button block bsStyle="success" bsSize="large" type="submit">
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
