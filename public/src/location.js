async function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: 0, longitude: 0 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      () => resolve({ latitude: 0, longitude: 0 }) 
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
  });
}

export { getUserLocation, geoFindMe };
