import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { signin, authenticate } from "../auth";
import SocialLogin from "./SocialLogin";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false,
      loading: false
    };
  }

  handleChange = name => e => {
    this.setState({ error: "" });
    this.setState({
      [name]: e.target.value
    });
  };

  clickSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password
    };

    signin(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        // authenticate
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
      }
    });
  };

  render() {
    const { email, password, error, redirectToReferer, loading } = this.state;
    if (redirectToReferer) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <h2 className="mt-5 mb-5 posts-header">Sign In</h2>
        <SocialLogin />
        <hr />
        <div
          className="alert alert-danger"
          style={{ display: error ? "block" : "none" }}
        >
          {error}
        </div>
        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}
        <form>
          <div className="form-group">
            <label className="text-muted">Email</label>
            <input
              className="form-control"
              type="email"
              onChange={this.handleChange("email")}
              value={email}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Password</label>
            <input
              className="form-control"
              type="password"
              onChange={this.handleChange("password")}
              value={password}
            />
          </div>
          <button
            className="btn btn-raised btn-primary"
            onClick={this.clickSubmit}
          >
            Sign In
          </button>

          <small>
            <Link to="/forgot-password" className="text-danger ml-3">
              {" "}
              Forgot Password
            </Link>
          </small>
        </form>
      </div>
    );
  }
}

export default Signin;
