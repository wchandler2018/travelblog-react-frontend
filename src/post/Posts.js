import React, { Component } from "react";
import { Link } from "react-router-dom";
import { list } from "./apiPost";
import defPostImg from "../images/defPostImg1.jpg";

class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      page: 1
    };
  }

  loadPosts = page => {
    list(page).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  loadMore = number => {
    this.setState({ page: this.state.page + number });
    this.loadPosts(this.state.page + number);
  };

  loadLess = number => {
    this.setState({ page: this.state.page - number });
    this.loadPosts(this.state.page - number);
  };

  componentDidMount() {
    this.loadPosts(this.state.page);
  }

  renderPosts = (posts, i) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : " unknown";
          return (
            <div
              className="card col-lg-3 col-md-6 col-sm-12 mb-4 mr-4"
              style={{ borderRadius: "5px" }}
              key={i}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                onError={i => (i.target.src = `${defPostImg}`)}
                alt={post.title}
                className="img-thumbnail mb-3 mt-3"
                style={{ height: "200px", width: "100%", borderRadius: "5px" }}
              />
              <div className="card-body">
                <h4 className="card-title text-center">{post.title}</h4>
                <p className="card-text ">{post.body.substring(0, 100)}</p>
                <br />
                <small className="font-italic mark">
                  Posted By:{" "}
                  <Link to={`${posterId}`} style={{ color: "#eb5e30" }}>
                    {posterName}
                  </Link>
                  <br />
                  {new Date(post.created).toDateString()}
                </small>
                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-block btn-primary btn-sm btn-raised mt-3"
                >
                  See More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts, page } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5 posts-header">
          {!posts.length ? "Loading..." : "Latest Post"}
        </h2>
        {this.renderPosts(posts)}
        {page > 1 ? (
          <button
            className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
            onClick={() => this.loadLess(1)}
          >
            Previous ({this.state.page - 1})
          </button>
        ) : (
          ""
        )}

        {posts.length ? (
          <button
            className="btn btn-raised btn-success mt-5 mb-5"
            onClick={() => this.loadMore(1)}
          >
            Next ({page + 1})
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Posts;
