import React, { Component } from "react";
import { Link } from "react-router-dom";
import { findPeople, follow } from "./apiUser";
import { isAuthenticated } from "../auth/index";
import defaultUser from "../images/defaultuser.jpg";

class FindPeople extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      error: "",
      open: false
    };
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    findPeople(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  renderUsers = users => (
    <div className="row">
      {users.map((user, i) => (
        <div
          className="card col-lg-4 col-md-6 col-sm-12 mb-4"
          style={{ borderRadius: "5px" }}
          key={i}
        >
          <img
            style={{
              height: "350px",
              width: "350px",
              marginTop: "20px",
              borderRadius: "50%",
              border: "1px solid black",
              backgroundPosition: "center center",
              backgroundSize: "cover"
            }}
            className="img-thumbnail mx-auto"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
            onError={i => (i.target.src = `${defaultUser}`)}
            alt={user.name}
          />
          <div className="card-body">
            <h4 className="card-title text-center">{user.name}</h4>
            <p className="card-text text-center">{user.email}</p>
            <Link
              to={`user/${user._id}`}
              className="btn btn-block btn-primary btn-raised"
            >
              View Profile
            </Link>
            <button
              className="btn btn-raised float-right btn-block btn-primary"
              onClick={() => this.clickFollow(user, i)}
            >
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  clickFollow = (user, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    follow(userId, token, user._id).then(data => {
      if (data.error) {
        this.setState({
          error: data.error
        });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(i, 1);
        this.setState({
          user: toFollow,
          open: true,
          followMessage: `Following ${user.name}`
        });
      }
    });
  };

  render() {
    const { users, open, followMessage } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5 posts-header">Friend Finder</h2>
        {open && (
          <div className="alert alert-success">
            {open && <p>{followMessage}</p>}
          </div>
        )}
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default FindPeople;
