import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";

class NewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      redirectToProfile: false,
      fileSize: 0,
      loading: false,
      user: {}
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({
        error: "File size should be less that 100kb "
      });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({
        error: "All fields are required",
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
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.postData).then(data => {
        if (data.error) this.setState({ error: data.error });
        else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            photo: "",
            redirectToProfile: true
          });
        }
      });
    }
  };

  render() {
    const { title, body, user, error, loading, redirectToProfile } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5 posts-header">Create a new post</h2>
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
            <label className="text-muted">Profile Image</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={this.handleChange("photo")}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Title</label>
            <input
              className="form-control"
              type="text"
              onChange={this.handleChange("title")}
              value={title}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Body</label>
            <textarea
              className="form-control"
              type="text"
              onChange={this.handleChange("body")}
              value={body}
            />
          </div>

          <button
            className="btn btn-raised btn-primary"
            onClick={this.clickSubmit}
          >
            Create Post
          </button>
        </form>
      </div>
    );
  }
}

export default NewPost;
