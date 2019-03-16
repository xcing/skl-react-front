import React, { Component } from "react";
// import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import "./css/Chat.css";

const cookies = new Cookies();

function TeamListItem(users) {
  if (users !== null) {
    const teamListItems = users.value.map(user =>
      user.team !== null ? (
        <div key={user.team.id}>
          <img className="logo" alt={user.team.name} src={user.team.img_icon} />
          {user.team.name}
        </div>
      ) : null
    );
    return <div>{teamListItems}</div>;
  }
}

function GroupListItem(users) {
  if (users !== null) {
    const groupListItems = users.value.map(user =>
      user.group.map(group => (
        <div key={group.id}>
          <img className="logo" alt={group.name} src={group.img_icon} />
          {group.name}
        </div>
      ))
    );
    return <div>{groupListItems}</div>;
  }
}

function FollowingListItem(users) {
  const followingListItems = users.value.map(user => (
    <div key={user.user.id}>
      <img className="logo" alt={user.user.name} src={user.user.avatar} />
      {user.user.name}
    </div>
  ));
  return <div>{followingListItems}</div>;
}

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingUserFollowing: true,
      userFollowing: null
    };
  }

  componentDidMount() {
    this.getUserFollowing();
  }

  processResponse(response) {
    return Promise.all([response.status, response.json()]).then(res => ({
      statusCode: res[0],
      data: res[1]
    }));
  }

  getUserFollowing() {
    fetch(process.env.REACT_APP_REST_API_LOCATION + "/api/follow/user/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: cookies.get("accessToken")
      }
    })
      .then(this.processResponse)
      .then(res => {
        if (res.statusCode !== 200) {
          console.log(res.data.message);
        } else {
          this.setState({
            loadingUserFollowing: false,
            userFollowing: res.data.data
          });
        }
      })
      .catch(error => {
        console.error(error);
        return { name: "network error", description: "" };
      });
  }

  render() {
    let teamListItems;
    let groupListItems;
    let followingListItems;
    if (this.props.user !== null) {
      teamListItems = <TeamListItem value={this.props.user} />;
      groupListItems = <GroupListItem value={this.props.user} />;
    }
    if (this.state.loadingUserFollowing) {
      followingListItems = <div>Loading</div>;
    } else {
      followingListItems = <FollowingListItem value={this.state.userFollowing}/>;
    }
    return (
      <React.Fragment>
        <div className="block-chat">
          {teamListItems}
          {groupListItems}
          {followingListItems}
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

// const mapDispatchToProps = dispatch => {
//   return {
//     fetchData: data => dispatch(addAllUserData(data))
//   };
// };

export default connect(
  mapStateToProps
  //   mapDispatchToProps
)(Chat);
