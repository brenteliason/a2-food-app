import React, { Component } from 'react';

class Map extends Component {

  componentDidMount() {
    console.log("Map placeholder did mount");
  }

  render() {
    return (
       <div id='map'>
        <span>Map placeholder</span>
       </div>
    )
  }
}

export default Map