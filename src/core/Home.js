import React from "react";
import Posts from "../post/Posts";
const Home = () => {
  return (
    <div>
      <div className="jumbotron bg-image">
        <h1 className="main-header">Vagabond Travelers</h1>
        <p className="lead main-tagline">
          Sign up, Make New Friends & Tell The World About Your Aventures.
        </p>
      </div>
      <div className="container">
        <Posts />
      </div>
    </div>
  );
};

export default Home;
