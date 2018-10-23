import React, { Component } from 'react';
import './App.css';
import SideMenu from './SideMenu';
import Map from './Map';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: []
    }
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
    this.setState({ restaurants: [
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
    })

    let get_google = this.getGoogleMaps();

    Promise.all([ get_google ])
    .then(values => {
      console.log(values);
      let google = values[0];
      this.google = google;
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 42.280826, lng: -83.743038 },
        zoom: 13
      });
    })

  }//END of componentdidmount

  render() {
    return (
      <div className="container">
        <SideMenu locations={this.state.restaurants}/>
        <Map locations={this.state.restaurants}/>
      </div>
    );
  }
}

export default App;
