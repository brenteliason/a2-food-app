import React, { Component } from 'react';
import './App.css';
import SideMenu from './SideMenu';
import Map from './Map';
import './styles.css';
import * as FSAPI from './FourSquareAPI';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      filtered: [],
      markers: [],
      infoBoxes: [],
      map: null,
      google: null,
      query: "",
      errorStatus: false
    }
    this.filterRestaurants = this.filterRestaurants.bind(this);
    this.clickListItem = this.clickListItem.bind(this);
    this.enterListItem = this.enterListItem.bind(this);

  }


  //Adapted from Udacity's Ryan Waite's tutorial on project 7
  getGoogleMaps() {
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        window.resolveGoogleMapsPromise = () => {
          resolve(window.google);
          delete window.resolveGoogleMapsPromise;
        };
        const script = document.createElement("script");
        const API = 'AIzaSyCp94ulCrrIQSdInreuhlCEoiac6noQBwo';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }
    return this.googleMapsPromise;
  }

  componentWillMount() {
    this.getGoogleMaps();
  }

  componentDidMount() {
    //console.log("App component has mounted");
    //HARD CODED LIST OF Ann Arbor restaurants from previous version, may want to come back and do restaurant version without FourSquare API
    /*this.setState({ restaurants: [
      {title: "Ayse's Turkish Cafe", location: {lat: 42.299009, lng: -83.721571}},
      {title: "Bell's Diner", location: {lat: 42.273374, lng: -83.776446}},
      {title: "Carson's American Bistro", location: {lat: 42.304574, lng: -83.695821}},
      {title: "The Chop House", location: {lat: 42.27884, lng: -83.748909}},
      {title: "Conor O'Neill's", location: {lat: 42.278807, lng: -83.749029}},
      {title: "First Bite", location: {lat: 42.28111, lng: -83.74885}},
      {title: "Frita Batidos", location: {lat: 42.280352, lng: -83.749441}},
      {title: "Gandy Dancer", location: {lat: 42.287214, lng: -83.741681}},
      {title: "Heidelberg", location: {lat: 42.282893, lng: -83.74881 }},
      {title: "HopCat", location: {lat: 42.279109, lng: -83.741846}},
      {title: "Isalita", location: {lat: 42.279587, lng: -83.744394}},
      {title: 'Jerusalem Garden', location: {lat: 42.279204, lng: -83.745421}},
      {title: "Jolly Pumpkin", location: {lat: 42.279158, lng: -83.748462}},
      {title: "Knight's Steakhouse", location: {lat: 42.284964, lng: -83.778129}},
      {title: "KouZina", location: {lat: 42.278484, lng: -83.748903}},
      {title: "Mani Osteria", location: {lat: 42.279689, lng: -83.74429}},
      {title: "Marnee Thai", location: {lat: 42.277408, lng: -83.749047}},
      {title: "Metzger's German Restaurant", location: {lat: 42.292776, lng: -83.839837}},
      {title: "Momo Sushi", location: {lat: 42.24533, lng: -83.758993}},
      {title: "The Old Siam by Siam Kitchen", location: {lat: 42.278952, lng: -83.782725}},
      {title: "Prickly Pear", location: {lat: 42.278618, lng: -83.748918}},
      {title: "The Quarter Bistro", location: {lat: 42.278382, lng: -83.781095}},
      {title: "Red Hawk Bar & Grill", location: {lat: 42.278755, lng: -83.74106}},
      {title: "Siam Square", location: {lat: 42.254639, lng: -83.686937}},
      {title: "Star's Cafe", location: {lat: 42.280119, lng: -83.782586}},
      {title: "La Taqueria", location: {lat: 42.279456, lng: -83.748154}},
      {title: "Zamaan Cafe", location: {lat: 42.304313, lng: -83.691194}},
      {title: "Zingerman's Deli", location: {lat: 42.284682, lng: -83.745071}}
    ]
    })*/

    let get_google = this.getGoogleMaps();//get reference to google maps API
    let get_restaurants = FSAPI.loadPlaces();//get list of locations from FourSquareAPI

    Promise.all([ get_google, get_restaurants ])
    .then(values => {
      //console.log(values);
      let google = values[0];
      this.google = google;
      this.infowindow = new google.maps.InfoWindow();
      this.setState(google: google);
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 42.280826, lng: -83.743038 },
        zoom: 13,
        mapTypeControl: false
      });
      this.setState(map: map);

      let restaurants = values[1];//get list of locations from promise
      let markers = [];//will store markers corresponding to each location
      let infoBoxes = [];//will store infoboxes attached to each marker for each location

      //loops through restaurants creating a corresponding marker and infobox for each one and adding it to the map
      for (var i = 0; i < restaurants.length; i++) {
        //console.log("Adding marker for restaurant #: " + i);
        //console.log("Restaurant from FourSquareAPI with id#: " + restaurants[i].id);
        var restaurant = restaurants[i];
        // Create a marker per location, and put into markers array.
        let marker = new google.maps.Marker({
          position: { lat: restaurant.location.lat, lng: restaurant.location.lng },
          id: restaurant.id,
          restaurant: restaurant,
          name: restaurant.name,
          animation: google.maps.Animation.DROP,
        });

        //create info box for each location
        let infoBox = '<div class="info_box">' +
        '<h4>' + restaurant.name + '</h4>' +
        '<p>' + FSAPI.aft(restaurant.location.formattedAddress) + '</p>' +
        '</div>';
        marker.addListener('click', () => {
          //console.log("Is this where the bug is?");
          //console.log("Is this the marker that was clicked?");
          //console.log(marker);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          if (marker.getAnimation() !== null) { marker.setAnimation(null); }
				  else { marker.setAnimation(google.maps.Animation.BOUNCE); }
				  setTimeout(() => { marker.setAnimation(null) }, 1500);
			  });
        google.maps.event.addListener(marker, 'click', () => {
          //console.log("Marker inside click listener for google maps");
          //console.log(marker);
           this.map.setCenter(marker.position);
           this.map.setZoom(15);
           this.infowindow.setContent(infoBox);
				   this.infowindow.open(this.map, marker);
			  });

        //add marker and infobox to arrays for later reference
        markers.push(marker);
        infoBoxes.push({ id: restaurant.id, name: restaurant.name, contents: infoBox });

        //add marker to map, no need to add infobox because those should only display when marker or sidemenu option is clicked
        marker.setMap(this.map);
      }//END OF FOR LOOP for adding markers and infoboxes for each restaurant

      //Alphabetize all restaurants, markers, and infoboxes for organization so sidemenu is alphabetized and indices are the same across arrays
      this.restaurants = FSAPI.sort_by(restaurants, "name", "asc");
      this.setState({restaurants: this.restaurants});
      this.markers = FSAPI.sort_by(markers, "name", "asc");
      this.setState({markers: this.markers});
      this.infoBoxes = FSAPI.sort_by(infoBoxes, "name", "asc");
      this.setState({infoBoxes: this.infoBoxes});
    })//END OF PROMISE
    .catch(error => {
      console.log("Error: " + error);
      this.setState({errorStatus: true});
    })

  } //END of componentdidmount

  //search for restaurants in list for limited display in side menu and then map
  filterRestaurants(query) {
    let f = query ? this.state.restaurants.filter(r => r.name.toLowerCase().includes(query.toLowerCase())) : this.state.restaurants;
    this.markers.forEach(m => {
      m.name.toLowerCase().includes(query.toLowerCase()) ?
      m.setVisible(true) :
      m.setVisible(false);
    });
    this.setState({ filtered: f, query: query });
  }

  //when an option is clicked on the side menu, this code triggers the corresponding marker on the map to bounce and display the infobox
  clickListItem(restaurant) {
      let marker = this.state.markers.filter(m => m.id === restaurant.id)[0];
      let info_obj = this.infoBoxes.filter(i => i.id === restaurant.id)[0];
      let infoBox = info_obj && info_obj.contents || "nothing...";
      if(marker && infoBox) {
        if (marker.getAnimation() !== null) { marker.setAnimation(null); }
        else { marker.setAnimation(this.google.maps.Animation.BOUNCE); }
        setTimeout(() => { marker.setAnimation(null) }, 1500);

        this.infowindow.setContent(infoBox);
        this.map.setZoom(13);
        this.map.setCenter(marker.position);
        this.infowindow.open(this.map, marker);
        this.map.panBy(0, -125);
      }
  }

  //handles enter key for list items
  enterListItem(event, restaurant) {
    //console.log("Inside enterListItem function")
    let keyCode = event.keyCode || event.which;
    //console.log(keyCode);
    if (keyCode === 13) {//if hit enter on list item, trigger same code as if it were clicked
      //console.log("Inside if statement");
      this.clickListItem(restaurant);
    }
  }

  render() {
    //console.log("Calling App render method with " + this.state.restaurants.length + " many restaurants and " + this.state.matches.length + " this many matches");
    if (this.state.errorStatus === true) {
      console.log("There's been an error");
      return (
        <main className="container">
          <span>There was an error loading the page. Please try again.</span>
          </main>
      )
    }
    else {
      return (
        <main className="container">
          <SideMenu
            locations={this.state.restaurants}
            matches={this.state.matches}
            query={this.state.query}
            filtered={this.state.filtered}
            filterRestaurants={this.filterRestaurants}
            clickListItem={this.clickListItem}
            enterListItem={this.enterListItem} />
          <Map locations={this.state.restaurants}/>
        </main>
      );
    }
  }
}

export default App;

//global function called by Google Maps API if key is invalid
function gm_authFailure() {
  let errorMessage = "Google Maps API key failed";
  console.log(errorMessage);
  alert(errorMessage);
  userAlert(errorMessage);
};

function userAlert(message) {
  const errorSpan = document.createElement("span");
  errorSpan.setAttribute("role", "alert");
  errorSpan.innerHTML = message;
  document.getElementById("container").appendChild(errorSpan);
}

//Copied from Mozilla MDN's explanation of onError method: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
window.addEventListener('error', function(event) {
  console.log("There has been an error");
  alert("There has been an error, see console for details");
});

//Copied from Mozilla MDN's explanation of onError method: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert(message);
    }

    return false;
};
