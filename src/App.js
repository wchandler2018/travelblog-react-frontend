import React, { Component } from "react";
import "./App.css";
import MainRouter from "./MainRouter";
import { BrowserRouter as Router } from "react-router-dom";

export class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <MainRouter />
        </div>
      </Router>
    );
  }
}

export default App;
