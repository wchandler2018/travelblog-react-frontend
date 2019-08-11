import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import defPostImg from "../images/defPostImg1.jpg";

class EditPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    };
  }

  init = postId => {
    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: ""
        });
      }
    });
  };

  clickSubmit = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    if (this.isValid()) {
      const postId = this.state.id;
      const token = isAuthenticated().token;

      update(postId, token, this.postData).then(data => {
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

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

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

  editPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Image</label>
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

      <button className="btn btn-raised btn-primary" onClick={this.clickSubmit}>
        Edit Post
      </button>
    </form>
  );
  render() {
    const { id, title, body, redirectToProfile, error, loading } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }
    return (
      <div className="container">
        <h2>{title}</h2>

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
          src={`${
            process.env.REACT_APP_API_URL
          }/post/photo/${id}?${new Date().getTime()}`}
          onError={i => (i.target.src = `${defPostImg}`)}
          alt={title}
          style={{
            height: "200px",
            width: "200px",
            borderRadius: "5px"
          }}
          className="img-thumbnail mb-5"
        />
        {this.editPostForm(title, body)}
      </div>
    );
  }
}

export default EditPost;
