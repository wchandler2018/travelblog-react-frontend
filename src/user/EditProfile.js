import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import defaultUser from "../images/defaultuser.jpg";

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      loading: false,
      fileSize: 0,
      about: ""
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({
        error: "File size should be less that 100kb "
      });
      return false;
    }

    if (name.length === 0) {
      this.setState({
        error: "name is required",
        loading: false
      });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        error: "please provide a valid email address",
        loading: false
      });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "password must contain at least 6 characters",
        loading: false
      });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      update(userId, token, this.userData).then(data => {
        if (data.error) this.setState({ error: data.error });
        else
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
      });
    }
  };

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about
    } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : defaultUser;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5 posts-header">Edit Your Profile</h2>
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
        <img
          src={photoUrl}
          onError={i => (i.target.src = `${defaultUser}`)}
          alt={name}
          style={{
            height: "200px",
            width: "200px",
            borderRadius: "50%",
            border: "1px solid black"
          }}
          className="img-thumbnail mb-5"
        />
        <form>
          <div className="form-group">
            <label className="text-muted">Profile Image</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={this.handleChange("photo")}
            />
          </div>
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
            <label className="text-muted">Biography</label>
            <textarea
              className="form-control"
              type="text"
              onChange={this.handleChange("about")}
              value={about}
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
            Update
          </button>
        </form>
      </div>
    );
  }
}

export default EditProfile;
