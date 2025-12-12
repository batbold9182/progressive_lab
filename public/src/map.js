let map;
let markers = [];

function initMap() {
  map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
}

function addPhotoMarker(entry) {
  if (entry.lat === null || entry.lon === null) return;
  /*const popupContent = `
    <div style="text-align:center;">
      <p><strong>${new Date(entry.timestamp).toLocaleString()}</strong></p>
      <img src="${entry.imageUrl}" style="width:150px;border-radius:10px;" />
      <p>Lat: ${entry.lat}, Lon: ${entry.lon}</p>
    </div>
  `;*/
  const container = document.createElement('div');
  container.style.textAlign = 'center';
  // time stamp ===========================================
  const time = document.createElement('p');
  time.innerHTML = `<strong>${new Date(entry.timestamp).toLocaleString()}</strong>`;
  container.appendChild(time);
  // image ================================================
  const img = document.createElement('img');
  img.src = entry.imageUrl;
  img.style.width = '150px';
  img.style.borderRadius = '10px';
  container.appendChild(img);
  // coordinates ========================================
  const coords = document.createElement('p');
  coords.textContent = `Lat: ${entry.lat}, Lon: ${entry.lon}`;
  container.appendChild(coords);
  //popup content ========================================
  const marker = L.marker([entry.lat, entry.lon]).addTo(map).bindPopup(container);
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
