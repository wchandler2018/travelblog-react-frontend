import React, { Component } from "react";
import { Link } from "react-router-dom";
import defaultUser from "../images/defaultuser.jpg";

class ProfileTabs extends Component {
  render() {
    const { following, followers, posts } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-primary">{followers.length} Followers</h3>
            {followers.map((person, i) => (
              <div key={i}>
                <div>
                  <Link to={`/user/${person._id}`}>
                    <img
                      style={{
                        borderRadius: "50%",
                        border: "1px solid black"
                      }}
                      className="float-left mr-2"
                      height="30px"
                      width="30px"
                      onError={i => (i.target.src = `${defaultUser}`)}
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${
                        person._id
                      }`}
                      alt={person.name}
                    />
                    <div>
                      <p className="lead">{person.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <h3 className="text-primary">Following</h3>
            {following.map((person, i) => (
              <div key={i}>
                <div>
                  <Link to={`/user/${person._id}`}>
                    <img
                      style={{
                        borderRadius: "50%",
                        border: "1px solid black"
                      }}
                      className="float-left mr-2"
                      height="30px"
                      width="30px"
                      onError={i => (i.target.src = `${defaultUser}`)}
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${
                        person._id
                      }`}
                      alt={person.name}
                    />
                    <div>
                      <p className="lead">{person.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <h3 className="text-primary">Posts</h3>
            {posts.map((post, i) => (
              <div key={i}>
                <div>
                  <Link to={`/post/${post._id}`}>
                    <div>
                      <p className="lead">{post.title}</p>
                    </div>
                  </Link>
                  <hr />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
