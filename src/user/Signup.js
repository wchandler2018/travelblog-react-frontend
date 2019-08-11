import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signup } from "../auth/index";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      open: false
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
    const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password
    };
    signup(user).then(data => {
      if (data.error) this.setState({ error: data.error });
      else
        this.setState({
          error: "",
          name: "",
          email: "",
          password: "",
          open: true
        });
    });
  };

  render() {
    const { name, email, password, error, open } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5 posts-header">Register</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "block" : "none" }}
        >
          {error}
        </div>
        <div
          className="alert alert-info"
          style={{ display: open ? "block" : "none" }}
        >
          Thank you for registering a new account. Please{" "}
          <Link to="/signin" className="text-success">
            Sign In
          </Link>
          .
        </div>
        <form>
          <div className="form-group">
            <label className="text-muted">Name</label>
            <input
              className="form-control"
              type="text"
              onChange={this.handleChange("name")}
              value={name}
            />
          </div>
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
            Register
          </button>
        </form>
      </div>
    );
  }
}

export default Signup;
