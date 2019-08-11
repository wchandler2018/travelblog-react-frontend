import React, { Component } from "react";
import { Link } from "react-router-dom";
import { list } from "./apiUser";
import defaultUser from "../images/defaultuser.jpg";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    list().then(data => {
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
          className="card col-lg-4 col-md-6 col-sm-12 mb-4 mr-4"
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
              to={`/user/${user._id}`}
              className="btn btn-block btn-primary btn-sm btn-raised"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5 posts-header">Users</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;
