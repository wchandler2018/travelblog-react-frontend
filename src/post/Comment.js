import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth/index";
import { Link } from "react-router-dom";
import defPostImg from "../images/defPostImg1.jpg";

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      error: ""
    };
  }

  handleChange = e => {
    this.setState({ error: "" });
    this.setState({
      text: e.target.value
    });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error:
          "You cannot post an empty comment or a comment longer than 150 characters"
      });
      return false;
    }
    return true;
  };

  addComment = e => {
    e.preventDefault();

    if (!isAuthenticated()) {
      this.setState({ error: "Please sign in to leave a comment." });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          // dispatch fresh list of coments to parent (SinglePost)
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  deleteComment = comment => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteConfirm = comment => {
    let answer = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (answer) {
      this.deleteComment(comment);
    }
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;
    return (
      <div>
        <h5 className="mt-5 mb-5">Tell us your thoughts below...</h5>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        <form onSubmit={this.addComment}>
          <div className="form-group">
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.text}
              className="form-control"
              placeholder="leave a comment..."
            />
            <button className="btn btn-raised btn-success mt-3">Comment</button>
          </div>
        </form>
        <hr />

        <div className="col-md-12 mb-5">
          <h3>
            <small className="text-primary">{comments.length} Comments</small>
          </h3>
          {comments.map((comment, i) => (
            <div key={i}>
              <div>
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    style={{
                      borderRadius: "50%",
                      border: "1px solid black"
                    }}
                    className="float-left mr-2"
                    height="30px"
                    width="30px"
                    onError={i => (i.target.src = `${defPostImg}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${
                      comment.postedBy._id
                    }`}
                    alt={comment.postedBy.name}
                  />
                </Link>
                <div>
                  <p className="lead">{comment.text}</p>{" "}
                  <small className="font-italic mark">
                    Posted By:{" "}
                    <Link
                      to={`/user/${comment.postedBy._id}`}
                      style={{ color: "#eb5e30" }}
                    >
                      {comment.postedBy.name}
                    </Link>
                    <br />
                    {new Date(comment.created).toDateString()}
                    <span>
                      {isAuthenticated().user &&
                        isAuthenticated().user._id === comment.postedBy._id && (
                          <React.Fragment>
                            <i
                              className="fas fa-trash-alt ml-3"
                              onClick={() => this.deleteConfirm(comment)}
                            />
                          </React.Fragment>
                        )}
                    </span>
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Comment;
