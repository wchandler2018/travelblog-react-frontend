import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import Menu from "./core/Menu";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import FindPeople from "./user/FindPeople";
import SinglePost from "./post/SinglePost";
import NewPost from "./post/NewPost";
import EditPost from "./post/EditPost";
import PrivateRoute from "./auth/PrivateRoute";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

const MainRouter = () => {
  return (
    <Router>
      <div>
        <Menu />
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute exact path="/post/create" component={NewPost} />
          <Route exact path="/post/:postId" component={SinglePost} />
          <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/reset-password/:resetPasswordToken"
            component={ResetPassword}
          />
          <PrivateRoute exact path="/users" component={Users} />

          <PrivateRoute
            exact
            path="/user/edit/:userId"
            component={EditProfile}
          />
          <PrivateRoute exact path="/findpeople" component={FindPeople} />
          <PrivateRoute exact path="/user/:userId" component={Profile} />
        </Switch>
      </div>
    </Router>
  );
};

export default MainRouter;
