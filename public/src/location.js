import { setView } from './map.js';

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));

    navigator.geolocation.getCurrentPosition(
      pos => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      err => reject(err),  
      { timeout: 10000, enableHighAccuracy: true }  
    );
  });
}


function geoFindMe() {
  getUserLocation().then((coords) => {
    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');
    status.textContent = '';
    mapLink.href = `https://www.openstreetmap.org/#map=18/${coords.latitude}/${coords.longitude}`;
    mapLink.textContent = `Latitude: ${coords.latitude}°, Longitude: ${coords.longitude}°`;
    setView(coords.latitude, coords.longitude, 15);
  }).catch((err) => {
    const status = document.querySelector('#status');
    status.textContent = `Unable to get location: ${err.message}`;
  });
}

export { getUserLocation, geoFindMe };
