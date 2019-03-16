import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./css/HomeColLeft.css";

function GameListItem(users) {
  if (users !== null) {
    const gameListItems = users.value.map(user => (
      <div key={user.game.id}>
        <Link to={"/game/" + user.game.idName}>
          <div>
            <img
              className="logo"
              alt={user.game.name}
              src={user.game.img_icon}
            />
          </div>
          <div>{user.game.name}</div>
        </Link>
      </div>
    ));
    return <div>{gameListItems}</div>;
  }
}

function TeamListItem(users) {
  if (users !== null) {
    const teamListItems = users.value.map(user =>
      user.team !== null ? (
        <div key={user.team.id}>
          <Link to={"/team/" + user.team.short_name}>
            <div>
              <img
                className="logo"
                alt={user.team.name}
                src={user.team.img_icon}
              />
            </div>
            <div>{user.team.name}</div>
          </Link>
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
          <Link to={"/group/" + group.short_name}>
            <div>
              <img className="logo" alt={group.name} src={group.img_icon} />
            </div>
            <div>{group.name}</div>
          </Link>
        </div>
      ))
    );
    return <div>{groupListItems}</div>;
  }
}

class HomeColLeft extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    let gameListItems;
    let teamListItems;
    let groupListItems;
    if (this.props.user !== null) {
      gameListItems = <GameListItem value={this.props.user} />;
      teamListItems = <TeamListItem value={this.props.user} />;
      groupListItems = <GroupListItem value={this.props.user} />;
    }
    return (
      <React.Fragment>
        <div className="block-left">
          {gameListItems}
          {teamListItems}
          {groupListItems}
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
)(HomeColLeft);
