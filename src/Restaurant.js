import React, { Component } from 'react';

class Restaurant extends Component {

  componentDidMount() {
    //console.log("Restaurant list item did mount");
  }

  render() {
    return (
       <li tabIndex="0" key={this.props.specialKey} onClick={this.props.onClick}>{this.props.name}</li>
    )
  }
}

export default Restaurant
