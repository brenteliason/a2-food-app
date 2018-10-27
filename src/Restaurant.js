import React, { Component } from 'react';
import './styles.css';

class Restaurant extends Component {

  componentDidMount() {
    //console.log("Restaurant list item did mount");
  }

  render() {
    return (
       <li tabIndex="0" key={this.props.key} id={this.props.restaurant.id} onClick={() => { this.props.clickListItem(this.props.restaurant) }}>{this.props.restaurant.name}</li>
    )
  }
}

export default Restaurant
