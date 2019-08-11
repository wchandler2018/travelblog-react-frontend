import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, signout } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#eb5e30" };
  else return { color: "#ffffff" };
};

function Menu({ history }) {
  return (
    <div className="menu">
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item ">
          <Link to="/" className="nav-link" style={isActive(history, "/")}>
            Home
          </Link>
        </li>
        <li className="nav-item ">
          <Link
            to="/users"
            className="nav-link"
            style={isActive(history, "/users")}
          >
            Users
          </Link>
        </li>

        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                to="/signin"
                className="nav-link"
                style={isActive(history, "/signin")}
              >
                Sign In
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/signup"
                className="nav-link"
                style={isActive(history, "/signup")}
              >
                Register
              </Link>
            </li>
          </Fragment>
        )}

        {isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                className="nav-link"
                to={`/findpeople`}
                style={isActive(history, `/findpeople`)}
              >
                Find Friends
              </Link>
            </li>
            <li className="nav-item">
              <li className="nav-item">
                <Link
                  to={`/post/create`}
                  style={isActive(history, `/post/create`)}
                  className="nav-link"
                >
                  New Post
                </Link>
              </li>
            </li>
            <li className="nav-item ">
              <span
                onClick={() => signout(() => history.push("/"))}
                className="nav-link"
                style={{ cursor: "pointer", color: "#ffffff" }}
              >
                Sign Out
              </span>
            </li>
            <li className="nav-item ml-auto">
              <Link
                className="nav-link"
                to={`/user/${isAuthenticated().user._id}`}
              >
                {`${isAuthenticated().user.name} 😀`}
              </Link>
            </li>
          </Fragment>
        )}
      </ul>
    </div>
  );
}

export default withRouter(Menu);
