import React, { Component } from 'react';
import './styles.css';

class Restaurant extends Component {

  componentDidMount() {
    //console.log("Restaurant list item did mount");
  }

  render() {
    return (
       <li tabIndex="0" key={this.props.specialkey} id={this.props.restaurant.id} aria-label="food option" role="link"
       onClick={() => { this.props.clickListItem(this.props.restaurant) }}
       onKeyPress={(event) => { this.props.enterListItem(event,this.props.restaurant) }}>{this.props.restaurant.name}</li>
    )
  }
}

export default Restaurant
