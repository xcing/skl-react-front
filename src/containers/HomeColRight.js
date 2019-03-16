import React, { Component } from "react";
// import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import "./css/HomeColRight.css";

const cookies = new Cookies();

function TournamentListItem(tournaments) {
  const tournamentListItems = tournaments.value.map(tournament => (
    <div key={tournament.id}>
      <img className="logo" alt={tournament.name} src={tournament.img} />
      {tournament.name}
    </div>
  ));
  return <div>{tournamentListItems}</div>;
}

function MatchingPlayerListItem(matchingPlayers) {
  const matchingPlayerListItems = matchingPlayers.value.map(matchingPlayer => (
    <div key={matchingPlayer.id}>
      <img className="logo" alt={matchingPlayer.name} src={matchingPlayer.avatar} />
      {matchingPlayer.name}
    </div>
  ));
  return <div>{matchingPlayerListItems}</div>;
}

class HomeColRight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tournament: {
        loading: true,
        data: null
      },
      matchingPlayer: {
        loading: true,
        data: null
      }
    };
  }

  componentDidMount() {
    this.getTournamentList();
    this.getMatchingPlayerList();
  }

  processResponse(response) {
    return Promise.all([response.status, response.json()]).then(res => ({
      statusCode: res[0],
      data: res[1]
    }));
  }

  getTournamentList() {
    fetch(process.env.REACT_APP_REST_API_LOCATION + "/api/tournament/list/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: cookies.get("accessToken")
      }
    })
      .then(this.processResponse)
      .then(res => {
        console.log(res);
        if (res.statusCode !== 200) {
          console.log(res.data.message);
        } else {
          this.setState({
            tournament: {
              loading: false,
              data: res.data.data
            }
          });
        }
      })
      .catch(error => {
        console.error(error);
        return { name: "network error", description: "" };
      });
  }

  getMatchingPlayerList() {
    fetch(process.env.REACT_APP_REST_API_LOCATION + "/api/player/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        limit: 3
      })
    })
      .then(this.processResponse)
      .then(res => {
        console.log(res);
        if (res.statusCode !== 200) {
          console.log(res.data.message);
        } else {
          this.setState({
            matchingPlayer: {
              loading: false,
              data: res.data.data
            }
          });
        }
      })
      .catch(error => {
        console.error(error);
        return { name: "network error", description: "" };
      });
  }

  render() {
    let tournamentListItems;
    if (this.state.tournament.loading) {
      tournamentListItems = <div>Loading</div>;
    } else {
      tournamentListItems = (
        <TournamentListItem value={this.state.tournament.data} />
      );
    }
    let matchingPlayerListItems;
    if (this.state.matchingPlayer.loading) {
      matchingPlayerListItems = <div>Loading</div>;
    } else {
      matchingPlayerListItems = (
        <MatchingPlayerListItem value={this.state.matchingPlayer.data} />
      );
    }
    return (
      <React.Fragment>
        <div className="block-right">
          <h3>Tournaments</h3>
          {tournamentListItems}
          <hr />
          <h3>Matching Player</h3>
          {matchingPlayerListItems}
          <hr />
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
)(HomeColRight);
