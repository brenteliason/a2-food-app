import React, { Component } from 'react';
import './App.css';
import SideMenu from "./SideMenu";
import './styles.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <SideMenu/>
      </div>
    );
  }
}

export default App;
