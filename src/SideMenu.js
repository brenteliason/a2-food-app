import React, { Component } from 'react';
import Restaurant from './Restaurant';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: this.props.locations,
      query: ""
    }
    //console.log("Constructor completed, this many restaurants should be in array " + this.props.locations.length);
  }

  componentDidMount() {
    //console.log("Side menu did mount");
    //console.log(this.props.locations);
    //this.setState({restaurants: this.props.locations});
  }

  //this method updates the query held in state with the latest contents of the search bar and then calls submitSearch
  updateQuery = (query) => {
    //console.log("Latest query: " + query);
    this.setState({query : query}, this.submitSearch);
  }

  submitSearch() {
    //console.log("Submit search function called, need to search for restaurants in list");
    //console.log("Number of restaurants is: " + this.state.restaurants.length);
    for (let i = 0; i < this.state.restaurants.length; i++) {
      //console.log("Check if restaurant " + i + " matches query " + this.state.query);
    }
  }

  render() {

      if (this.props.query === "") {
        //console.log("No query");
        return (
           <div className="options-box">
             <h1>Find Food in A2</h1>
             <div>
               <input id="restaurant-search" type="text" placeholder="Search for a restaurant" value={this.props.query}
                onChange={(event) => this.props.filterRestaurants(event.target.value)}/>
               <input id="go-places" type="button" value="Go"/>
             </div>
             <hr/>
             <div id="restaurant-list">
              <ul>
                {this.props.locations.map((restaurant, key) => (
                    <li key={key}>{restaurant.name}</li>
                ))}
              </ul>
             </div>
           </div>
        )
      }
      else {
        //console.log("active query");
        return (
           <div className="options-box">
             <h1>Find A Restaurant in A2</h1>
             <div>
               <input id="restaurant-search" type="text" placeholder="Search for a restaurant" value={this.props.query}
                onChange={(event) => this.props.filterRestaurants(event.target.value)}/>
               <input id="go-places" type="button" value="Go"/>
             </div>
             <hr/>
             <div id="restaurant-list">
              <ul>
                {
                  this.props.filtered && this.props.filtered.map((restaurant, key) => (
                    <Restaurant name={restaurant.name} specialKey={key} onClick={this.props.clickItem} />
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
