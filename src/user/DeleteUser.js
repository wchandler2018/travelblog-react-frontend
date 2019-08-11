import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { remove } from "./apiUser";
import { signout } from "../auth";
import { Redirect } from "react-router-dom";

class DeleteUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    };
  }

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    remove(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        //signout user
        signout(() => console.log("user is deleted"));
        //redirect user
        this.setState({
          redirect: true
        });
      }
    });
  };

  deleteConfirm = () => {
    let answer = window.confirm("Are you sure, we will miss you! 😢");
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <button
          className="btn btn-raised btn-sm btn-danger"
          onClick={this.deleteConfirm}
        >
          Delete Profile
        </button>
      </React.Fragment>
    );
  }
}

export default DeleteUser;
