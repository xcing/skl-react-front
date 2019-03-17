import React, { Component } from "react";
import {
  Button,
  FormGroup,
  FormControl,
  ControlLabel,
  Grid,
  Row,
  Col
} from "react-bootstrap";
import Cookies from "universal-cookie";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import "./css/Login.css";
import DateTime from "react-datetime";

const cookies = new Cookies();

export const addAllUserData = data => ({
  type: "ADD_ALL_USER_DATA",
  data: data
});

class CreateCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      subject: "",
      description: "",
      category_id: 1,
      number_of_student: 0,
      start_time: "",
      end_time: "",
      categoryData: [
        {
          id: 1,
          name: "Waiting..."
        }
      ],
      redirect: false
    };
  }

  componentDidMount() {
    if (this.props.user == null && cookies.get("accessToken") != null) {
      this.getUserData();
    }
    this.getCategoryData();
  }

  validateForm() {
    return (
      this.state.name.length > 0 &&
      this.state.subject.length > 0 &&
      this.state.description.length > 0 &&
      this.state.number_of_student.length > 0 &&
      this.state.start_time.length > 0 &&
      this.state.end_time.length > 0
    );
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

  handleDateChange = event => {
    let datetimeArr = event.target.value.split(" ");
    let dateArr = datetimeArr[0].split("/");
    this.setState({
      [event.target.id]:
        dateArr[2] +
        "-" +
        dateArr[0] +
        "-" +
        dateArr[1] +
        " " +
        datetimeArr[1] +
        ":00"
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    fetch(process.env.REACT_APP_REST_API_LOCATION + "/api/course/create", {
      method: "POST",
      headers: {
        Authorization: cookies.get("accessToken"),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      dataType: "json",
      body: JSON.stringify(this.state)
    })
      .then(this.processResponse)
      .then(res => {
        if (res.statusCode !== 200) {
          console.log(res.data.message);
        } else {
          console.log(res.data);
          alert('Create Complete');
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
        <div className="Home">
          <form onSubmit={this.handleSubmit}>
            <Grid>
              <Row>
                <Col md={4}>
                  <FormGroup controlId="name" bsSize="large">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                      autoFocus
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup controlId="subject" bsSize="large">
                    <ControlLabel>Subject</ControlLabel>
                    <FormControl
                      autoFocus
                      value={this.state.subject}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup controlId="number_of_student" bsSize="large">
                    <ControlLabel>Number of student</ControlLabel>
                    <FormControl
                      value={this.state.number_of_student}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup controlId="description" bsSize="large">
                    <ControlLabel>Description</ControlLabel>
                    <FormControl
                      value={this.state.description}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup controlId="category_id">
                    <ControlLabel>Category</ControlLabel>
                    <FormControl
                      componentClass="select"
                      value={this.state.category_id}
                      onChange={this.handleChange}
                    >
                      {this.state.categoryData.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <ControlLabel>Start DateTime</ControlLabel>
                  <DateTime
                    locale="th"
                    inputProps={{
                      id: "start_time",
                      onChange: this.handleDateChange,
                      onBlur: this.handleDateChange,
                      autoComplete: "off"
                    }}
                  />
                </Col>
                <Col md={4}>
                  <ControlLabel>End DateTime</ControlLabel>
                  <DateTime
                    locale="th"
                    inputProps={{
                      id: "end_time",
                      onChange: this.handleDateChange,
                      onBlur: this.handleDateChange,
                      autoComplete: "off"
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <ControlLabel>&nbsp;</ControlLabel>
                  <Button
                    block
                    bsStyle="primary"
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                  >
                    Create
                  </Button>
                </Col>
                <Col md={6}>
                  <ControlLabel>&nbsp;</ControlLabel>
                  <Link to={"/"}>
                    <Button block bsStyle="danger" bsSize="large" type="button">
                      Cancel
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Grid>
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
)(CreateCourse);
