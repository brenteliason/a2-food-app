//Adapted from Udacity's Ryan Waite tutorial on project 7

import idb from 'idb';

export const dbPromise = idb.open('restaurants-app-db', 1, upgradeDB => {
  upgradeDB.createObjectStore('ajax_fetches');
  var venues_store = upgradeDB.createObjectStore('venues', { keyPath: 'id' });
  venues_store.createIndex('id', 'id');
});

export function getAJAXfetches(key) {
  if(!key) {
    console.log(key);
    return Promise.reject('"key" argument is required');
  }
  if(key.constructor !== String) {
    console.log(key);
    return Promise.reject('"key" must be a string');
  }
  return dbPromise.then(db => {
    return db.transaction('ajax_fetches').objectStore('ajax_fetches').get(key);
  })
}

//returns the locations fetched in a usable form
export function getVenues() {
  return dbPromise.then(db => {
    return db.transaction('venues').objectStore('venues').getAll();
  })
}

export function storeAJAXfetch(key, value) {
  if(!key) {
    console.log(key);
    return Promise.reject('"key" argument is required');
  }
  if(key.constructor !== String) {
    console.log(key);
    return Promise.reject('"key" must be a string');
  }
  if(!value) {
    console.log(value);
    return Promise.reject('"value" argument is required');
  }
  return dbPromise.then(db => {
    const tx = db.transaction('ajax_fetches', 'readwrite');
    let store = tx.objectStore('ajax_fetches');
    store.put(value, key);
    return tx.complete;
  });
}

//lets you store locations fetched from API into array
export function storeVenues(venues) {
  if(!venues || !Array.isArray(venues)) {
    console.log(venues);
    return Promise.reject('"venues" argument must be an array');
  }
  if(venues.length === 0) {
    console.log(venues);
    return Promise.reject('"venues" array length must be greater than 1');
  }
  for(let r of venues) {
    if(r.constructor !== Object) {
      console.log(r);
      return Promise.reject('each item in "venues" must be an object literal');
    }
    if(!r.id) {
      console.log(r);
      return Promise.reject('each item in "venues" must have "id" property');
    }
  }
  return dbPromise.then(db => {
    const tx = db.transaction('venues', 'readwrite');
    let store = tx.objectStore('venues');
    venues.forEach(venue => { store.put(venue) });
    return tx.complete;
  });
}

//sorts arrays into alphabetical order for organization purposes, like having side list alphabetized
export function sort_by(array, property, direction) {
  let tempArray = array;
  tempArray.sort(function(a, b){
    var x = a[property].constructor === String && a[property].toLowerCase() || a[property];
    var y = b[property].constructor === String && b[property].toLowerCase() || b[property];
    let value = direction && String(direction) || "asc";
    switch(value) {
      case "asc":
        // asc
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      case "desc":
        // desc
        if (x > y) {return -1;}
        if (x < y) {return 1;}
        return 0;
      default:
        // asc
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    }
  });
  return tempArray;
}

export function aft(l) {
  let s = "";
  let i = 0;
  let e = l.length - 1;
  for(i = 0; i < e; i++) {
    s += (l[i] + "<br/>")
  }
  s += l[i];
  return s;
}

//FIRST function called from App that interacts with FourSquareAPI to load locations, apiURL has built in options to search for 15 locations with the keyword "food" near Ann Arbor
export function loadPlaces() {
  return new Promise(function(resolve, reject){
    getVenues()
    .then(venues => {
      if(venues.length > 0) {
        //console.log('returning venues from idb');
        return resolve(venues) ;
      }
      console.log('fetching restaurants...');
      var apiURL = 'https://api.foursquare.com/v2/venues/search?client_id=SGCLM1SZUBLUEKM42ZX4FI45UL3QKIVBQRYBXRJDIYCI0XZM&client_secret=XLWNC1AN4EML4JVZOCORFQVWW3BIC1WEFKEEGQLD03DTUHUS&v=20130815%20&limit=15&ll=42.280826,-83.743038&query=food';
      fetch(apiURL)
      .then(resp => resp.json())
      .then(json => {
        let { venues } = json.response;
        console.log('storing restaurants...');
        storeVenues(venues)
        .then(res => {
          console.log('stored restaurants');
          return resolve(venues);
        })
      })
      .catch(error => {
        console.log("Four Square API connection failed");
        reject(error);
      })
    })
    .catch(error => {
      console.log("Four Square API connection failed");
      reject(error);
    })
  });
}
