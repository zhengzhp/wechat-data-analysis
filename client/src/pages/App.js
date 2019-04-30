import React from "react";
import logo from "../assets/logo.svg";
import userList from "../model/userList";
import "../styles/App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: true
    };
  }

  componentDidMount(){
    userList()
  }

  render() {
    const { test } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          {test ? <img src={logo} className="App-logo" alt="logo" /> : null}
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
