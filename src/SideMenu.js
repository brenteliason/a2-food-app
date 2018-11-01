import React, { Component } from 'react';
import Restaurant from './Restaurant';
import './styles.css';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: this.props.locations
      //query: ""
    }
    //console.log("Constructor completed, this many restaurants should be in array " + this.props.locations.length);
  }

  render() {

      if (this.props.query === "") {
        //console.log("No query");
        return (
           <div className="options-box" aria-label="menu">
             <h1>Find Food in A2</h1>
             <div>
               <input id="restaurant-search" type="text" placeholder="Search for a restaurant" value={this.props.query}
                onChange={(event) => this.props.filterRestaurants(event.target.value)}/>
               <input id="go-places" type="button" value="Go"/>
             </div>
             <hr/>
             <div id="restaurant-list" aria-label="list of restaurants">
              <ul>
                {
                  this.props.locations && this.props.locations.map((restaurant, key) => (
                    <Restaurant restaurant={restaurant} key={key} specialkey={key} clickListItem={this.props.clickListItem} enterListItem={this.props.enterListItem} />
                  ))
                }
              </ul>
             </div>
           </div>
        )
      }
      else {
        //console.log("active query");
        return (
           <div className="options-box" aria-label="menu">
             <h1>Find Food in A2</h1>
             <div>
               <input id="restaurant-search" type="text" aria-label="searchbar for food options" placeholder="Search for food" value={this.props.query}
                onChange={(event) => this.props.filterRestaurants(event.target.value)}/>
               <input id="go-places" type="button" value="Go"/>
             </div>
             <hr/>
             <div id="restaurant-list" aria-label="list of restaurants">
              <ul>
               {
                 this.props.filtered && this.props.filtered.map((restaurant, key) => (
                    <Restaurant restaurant={restaurant} key={key} specialkey={key} clickListItem={this.props.clickListItem} enterListItem={this.props.enterListItem} />
                 ))
               }
              </ul>
             </div>
           </div>
        )
      }
  }
}

export default SideMenu
