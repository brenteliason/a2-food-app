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
      query: ""
    }
    this.filterRestaurants = this.filterRestaurants.bind(this);
    this.clickListItem = this.clickListItem.bind(this);
  }

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
    /*if (this.state.query === "") {
      this.setState({matches: this.state.restaurants});
      //console.log("Inside App componentDidMount, matches should equal restaurants: " + this.state.restaurants.length + " =? " + this.state.matches.length);
    }*/

    let get_google = this.getGoogleMaps();
    let get_restaurants = FSAPI.loadPlaces();

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

      let restaurants = values[1];

      let markers = [];
      let infoBoxes = [];
      //console.log("Now loading restaurant markers");

      for (var i = 0; i < restaurants.length; i++) {//ADD MARKER AND INFOWINDOW FOR EACH RESTAURANT
        //console.log("Adding marker for restaurant #: " + i);
        //console.log("Restaurant from FourSquareAPI with id#: " + restaurants[i].id);
        var restaurant = restaurants[i];
        // Get the title and location from the restaurant array.
        //var name = restaurant.name;
        //var position = { lat: restaurant.location.lat, lng: restaurant.location.lng };
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          position: { lat: restaurant.location.lat, lng: restaurant.location.lng },
          id: restaurant.id,
          restaurant: restaurant,
          name: restaurant.name,
          animation: google.maps.Animation.DROP,
          //icon: defaultIcon,
        });

        let infoBox = '<div class="info_box">' +
        '<h4>' + restaurant.name + '</h4>' +
        '<p>' + FSAPI.aft(restaurant.location.formattedAddress) + '</p>' +
        '</div>';
        marker.addListener('click', () => {
          console.log("Is this where the bug is?");
          console.log("Is this the marker that was clicked?")
          //console.log(marker);
          //marker.setAnimation(google.maps.Animation.BOUNCE);
          if (marker.getAnimation() !== null) { marker.setAnimation(null); }
				  else { marker.setAnimation(google.maps.Animation.BOUNCE); }
				  setTimeout(() => { marker.setAnimation(null) }, 1500);
			  });
        google.maps.event.addListener(marker, 'click', () => {
  			   this.infowindow.setContent(infoBox);
				   //this.map.setZoom(15);
				   //this.map.setCenter(marker.position);
				   this.infowindow.open(this.map, marker);
				   //this.map.panBy(0, -125);
			  });

        marker.setMap(this.map);
        markers.push(marker);
        infoBoxes.push({ id: restaurant.id, name: restaurant.name, contents: infoBox });

        // Push the marker to our array of markers.
        //this.state.markers[i] = marker;

        /*marker.addListener('click', function() {
          populateInfoWindow(this, infowindow);
        });*/



      }//END OF FOR LOOP for adding markers and infoboxes for each restaurant

      this.restaurants = FSAPI.sort_by(restaurants, "name", "asc");
      this.setState({restaurants: this.restaurants});
      this.markers = FSAPI.sort_by(markers, "name", "asc");
      this.setState({markers: this.markers});
      //console.log("state markers length equals: " + this.state.markers.length);
      //console.log(this.state.markers);
      this.infoBoxes = FSAPI.sort_by(infoBoxes, "name", "asc");
      this.setState({infoBoxes: this.infoBoxes});

      /*for (let j = 0; j < restaurants.length; j++) {
        markers[j].addListener('click', () => {
          console.log("Is this where the bug is?");
          console.log("Is this the marker that was clicked?")
          console.log(markers[j]);
          //marker.setAnimation(google.maps.Animation.BOUNCE);
          if (markers[j].getAnimation() !== null) { markers[j].setAnimation(null); }
          else { markers[j].setAnimation(google.maps.Animation.BOUNCE); }
          setTimeout(() => { markers[j].setAnimation(null) }, 1500);
        });
        google.maps.event.addListener(markers[j], 'click', () => {
           this.infowindow.setContent(infoBoxes[j]);
           //this.map.setZoom(15);
           //this.map.setCenter(marker.position);
           this.infowindow.open(this.map, markers[j]);
           //this.map.panBy(0, -125);
        });
      }*/






      //console.log("Printing markers before second for loop...");
      //console.log(this.state.markers);

      //var bounds = new google.maps.LatLngBounds();
      // Extend the boundaries of the map for each marker and display the marker
      /*for (var j = 0; j < this.state.markers.length; j++) {
        //this.state.markers[j].setMap(this.map);
        //bounds.extend(this.state.markers[i].position);

        /*marker.addListener('click', function() {
          // Check to make sure the infowindow is not already opened on this marker.
          if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
              infowindow.marker = null;
            });
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // In case the status is OK, which means the pano was found, compute the
            // position of the streetview image, then calculate the heading, then get a
            // panorama from that and set the options
            function getStreetView(data, status) {
              if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                  nearStreetViewLocation, marker.position);
                  infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                  var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                      heading: heading,
                      pitch: 30
                    }
                  };
                var panorama = new google.maps.StreetViewPanorama(
                  document.getElementById('pano'), panoramaOptions);
              } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                  '<div>No Street View Found</div>');
              }
            }
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            // Open the infowindow on the correct marker.
            infowindow.open(this.map, marker);
          }//END OF IF STATEMENT AT TOP*/
        //}*///END of For loop

        //document.getElementById('show-restaurants').addEventListener('click', this.showRestaurants);

        //document.getElementById('hide-restaurants').addEventListener('click', this.hideRestaurants);

    })//END OF PROMISE

  } //END of componentdidmount

  showRestaurants() {
    //console.log("Show Restaurants button clicked");
    //let google = this.getGoogleMaps();
    /*var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < this.state.markers.length; i++) {
      this.state.markers[i].setMap(this.state.map);
      bounds.extend(this.state.markers[i].position);
    }
    this.state.map.fitBounds(bounds);*/
  }

  // This function will loop through the restaurants and hide them all.
  hideRestaurants() {
    //console.log("Hide restaurants button clicked");
    /*for (var i = 0; i < this.state.markers.length; i++) {
      this.state.markers[i].setMap(null);
    }*/
  }

  /*updateQuery = (query) => {
    console.log("Latest query: " + query);
    //this.setState({query : query});
    //this.filterRestaurants(query.toLowerCase());
  }*/

  filterRestaurants(query) {
    let f = query ? this.state.restaurants.filter(r => r.name.toLowerCase().includes(query.toLowerCase())) : this.state.restaurants;
    this.markers.forEach(m => {
      m.name.toLowerCase().includes(query.toLowerCase()) ?
      m.setVisible(true) :
      m.setVisible(false);
    });
    this.setState({ filtered: f, query: query });
  }

  clickListItem(restaurant) {
      //console.log("Clicked on restaurant:");
      //console.log("Restaurant id equals: " + restaurant.id);

      //console.log("State restaurants are: ");
      //console.log(this.state.restaurants[0].id);
      //console.log("state markers length equals: " + this.state.markers.length);
      //console.log(this.state.markers);

      //console.log("First marker id equals: " + this.state.markers[0].id);
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

  searchRestaurants(query) {
    //console.log("Submit search function called, need to search for restaurants in list");
    //console.log("Number of restaurants is: " + this.state.restaurants.length);
    this.setState({matches: []});
    //console.log("After resetting matches, length is: " + this.state.matches.length);
    if (query !== "") {
      let matchCount = 0;
      //let queryMatches = [];
      for (let i = 0; i < this.state.restaurants.length; i++) {
        //console.log("Check if restaurant " + i + " matches query " + query);
        if (this.state.restaurants[i].title.toLowerCase().includes(query)) {
          //console.log("MATCH! " + query + " found in " + this.state.restaurants[i].title);
          let matchTitle = this.state.restaurants[i].title;
          let matchPosition = this.state.restaurants[i].location;
          this.setState({matches: [...this.state.matches, this.state.restaurants[i]]});
          //queryMatches.push({matchTitle, matchPosition});
          matchCount++;
        }
      }
      //console.log("Matchcount equals " + matchCount);
      //console.log("queryMatches length equals " + queryMatches.length);
      //this.setState({matches: queryMatches});
      //console.log("State.matches length equals " + this.state.matches.length);
      //console.log(this.state.matches);
    }
    else {
      //console.log("No query at this time - all restaurants match");
      //console.log("\tLength of matches should be 0, it is: " + this.state.matches.length);
      //this.setState({matches: this.state.restaurants});
      //console.log("RESTAURANTS []" + this.state.restaurants);
      //console.log("MATCHES []" + this.state.matches);
    }
  }

  render() {
    //console.log("Calling App render method with " + this.state.restaurants.length + " many restaurants and " + this.state.matches.length + " this many matches");
    return (
      <div className="container">
        <SideMenu
          locations={this.state.restaurants}
          matches={this.state.matches}
          query={this.state.query}
          filtered={this.state.filtered}
          filterRestaurants={this.filterRestaurants}
          clickListItem={this.clickListItem} />
        <Map locations={this.state.restaurants}/>
      </div>
    );
  }
}

export default App;

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
/*function populateInfoWindow(marker, infowindow) {
  //console.log("Need to populate infowindow for marker: " + marker.title);
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}*/ //END OF populate info window method
