import React, { Component } from 'react';

class SideMenu extends Component {

  componentDidMount() {
    console.log("Side menu did mount");
  }

  render() {
    return (
       <div className="options-box">
         <h1>Find A Restaurant in A2</h1>
         <div>
           <input id="show-restaurants" type="button" value="Show Restaurants"/>
           <input id="hide-restaurants" type="button" value="Hide Restaurants"/>
         </div>
         <hr/>
         <div>
           <span className="text">Search for restaurants by name</span>
           <input id="places-search" type="text" placeholder="Ex: Zingerman's Deli"/>
           <input id="go-places" type="button" value="Go"/>
         </div>
         <hr/>
         <div id="restaurant-list">
          <ul>
            {this.props.locations.map((restaurant, key) => (
                <li key={key}>{restaurant.title}</li>
            ))}
          </ul>
         </div>
       </div>
    )
  }
}

export default SideMenu
