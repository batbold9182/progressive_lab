let map;
let markers = [];

function initMap() {
  map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
}

function addPhotoMarker(entry) {
  if (entry.lat == null || entry.lon == null) return;
  const popupContent = `
    <div style="text-align:center;">
      <p><strong>${new Date(entry.timestamp).toLocaleString()}</strong></p>
      <img src="${entry.imageUrl}" style="width:150px;border-radius:10px;" />
      <p>Lat: ${entry.lat}, Lon: ${entry.lon}</p>
    </div>
  `;
  const marker = L.marker([entry.lat, entry.lon]).addTo(map).bindPopup(popupContent);
  markers.push(marker);
}

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

function removeMarkerByFilename(filename) {
  const markerToRemove = markers.find(marker =>
    marker.getPopup && marker.getPopup().getContent().includes(filename)
  );
  if (markerToRemove) {
    map.removeLayer(markerToRemove);
    markers = markers.filter(m => m !== markerToRemove);
    return true;
  }
  return false;
}

function setView(lat, lon, zoom = 12) {
  if (map && typeof map.setView === 'function') map.setView([lat, lon], zoom);
}

export { initMap, addPhotoMarker, clearMarkers, removeMarkerByFilename, setView };
