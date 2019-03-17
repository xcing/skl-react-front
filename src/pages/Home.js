import React, { Component } from "react";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";
import {
  Button,
  FormGroup,
  FormControl,
  ControlLabel,
  Grid,
  Col,
  Row,
  Table
} from "react-bootstrap";
import "./css/Home.css";
import DateTime from "react-datetime";

const cookies = new Cookies();

export const addAllUserData = data => ({
  type: "ADD_ALL_USER_DATA",
  data: data
});

function CourseListItem(courseData) {
  if (courseData.value !== "") {
    const courseListItems = courseData.value.map(course => (
      <tr key={course.id}>
        <td>{course.instructor.firstname}</td>
        <td>{course.category.name}</td>
        <td>{course.subject}</td>
        <td>{course.description}</td>
        <td>{course.number_of_student}</td>
        <td>{course.start_time}</td>
        <td>{course.end_time}</td>
      </tr>
    ));
    return courseListItems;
  }
}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      name: '',
      category_id: undefined,
      start_time: undefined,
      end_time: undefined,
      categoryData: [
        {
          id: 1,
          name: "Waiting..."
        }
      ],
      courseData: undefined
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
    this.getCourseData();
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

  getCourseData() {
    fetch(process.env.REACT_APP_REST_API_LOCATION + "/api/course", {
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
          this.setState({ courseData: res.data.data });
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

  handleDateChange = event => {
    let datetimeArr = event.target.value.split(" ");
    let dateArr = datetimeArr[0].split("/");
    this.setState({
      [event.target.id]: dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1]+" "+datetimeArr[1]+":00"
    });
  };

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.getCourseData();
  };

  render() {
    const { redirect } = this.state;
    if (redirect && window.location.pathname !== "/login") {
      return <Redirect to="/login" />;
    }

    let courseListItems;
    if (this.state.courseData !== undefined) {
      courseListItems = <CourseListItem value={this.state.courseData} />;
    }

    return (
      <React.Fragment>
        <div className="Home">
          <form onSubmit={this.handleSubmit}>
            <Grid>
              <Row>
                <Col md={3}>
                  <FormGroup controlId="name">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                      autoFocus
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup controlId="category_id">
                    <ControlLabel>Category</ControlLabel>
                    <FormControl
                      componentClass="select"
                      value={this.state.category_id}
                      onChange={this.handleChange}
                    >
                    <option key={0} value="">-- All --</option>
                      {this.state.categoryData.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col md={2}>
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
                <Col md={2}>
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
                <Col md={2}>
                  <ControlLabel>&nbsp;</ControlLabel>
                  <Button block bsStyle="success" type="submit">
                    Search
                  </Button>
                </Col>
              </Row>
            </Grid>
          </form>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Instructor</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Number of student</th>
                <th>Start datetime</th>
                <th>End datetime</th>
              </tr>
            </thead>
            <tbody>{courseListItems}</tbody>
          </Table>
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
