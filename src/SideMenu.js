import React, { Component } from 'react';
import Restaurant from './Restaurant';
import './styles.css';

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
                {
                  this.props.locations && this.props.locations.map((restaurant, key) => (
                    <Restaurant restaurant={restaurant} key={key} clickListItem={this.props.clickListItem} />
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
                    <Restaurant restaurant={restaurant} key={key} clickListItem={this.props.clickListItem} />
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
