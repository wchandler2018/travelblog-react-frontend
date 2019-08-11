import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import defPostImg from "../images/defPostImg1.jpg";
import { isAuthenticated } from "../auth/index";

import Comment from "./Comment";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: []
  };

  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        });
      }
    });
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;
    callApi(userId, token, postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length
        });
      }
    });
  };

  updateComments = comments => {
    this.setState({ comments });
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirm = () => {
    let answer = window.confirm(
      "This post is awesome, are you sure you want to delete it?"
    );
    if (answer) {
      this.deletePost();
    }
  };

  renderPost = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " unknown";

    const { like, likes } = this.state;
    return (
      <div className="card col-lg-12 mb-4 mr-4" style={{ borderRadius: "5px" }}>
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          onError={i => (i.target.src = `${defPostImg}`)}
          alt={post.title}
          className="img-thumbnail mb-3 mt-3"
          style={{
            height: "400px",
            width: "100%",
            objectFit: "cover",
            borderRadius: "5px"
          }}
        />

        {like ? (
          <h3 onClick={this.likeToggle}>
            <i
              className="far fa-thumbs-up text-success bg-light"
              style={{ padding: "10px", borderRadius: "50%" }}
            />
            <small className="ml-1">{likes}</small>
          </h3>
        ) : (
          <h3 onClick={this.likeToggle}>
            <i
              className="far fa-thumbs-up text-danger bg-light"
              style={{ padding: "10px", borderRadius: "50%" }}
            />
            <small className="ml-1">{likes}</small>
          </h3>
        )}

        <div className="card-body">
          <p className="card-text ">{post.body}</p>
          <br />
          <p className="font-italic mark">
            Posted By:{" "}
            <Link to={`${posterId}`} style={{ color: "#eb5e30" }}>
              {posterName}
            </Link>
            <br />
            {new Date(post.created).toDateString()}
          </p>
          <div className="d-inline-block">
            <Link to={`/`} className="btn btn-primary btn-raised mr-3">
              Back To Posts
            </Link>

            {isAuthenticated().user &&
              isAuthenticated().user._id === post.postedBy._id && (
                <React.Fragment>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-primary btn-raised mr-3"
                  >
                    Update Post
                  </Link>
                  <button
                    onClick={this.deleteConfirm}
                    className="btn btn-raised btn-warning"
                  >
                    Delete Post
                  </button>
                </React.Fragment>
              )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToHome, redirectToSignin, comments } = this.state;

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={"/signin"} />;
    }

    return (
      <div className="container">
        <h2 className="display-2 text-center mb-3 mt-3">{post.title}</h2>
        {!post ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}

export default SinglePost;
