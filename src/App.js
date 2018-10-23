import React, { Component } from 'react';
import './App.css';
import SideMenu from './SideMenu';
import Map from './Map';
import './styles.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <SideMenu/>
        <Map/>
      </div>
    );
  }
}

export default App;
