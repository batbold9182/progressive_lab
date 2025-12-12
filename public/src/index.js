import { setupCamera, takePicture, clearPhoto, startButton } from './camera.js';
import { getUserLocation, geoFindMe } from './location.js';
import { fetchPhotos, uploadPhoto, deletePhoto } from './api.js';
import { addPhotoToGallery, clearGallery, removePhotoByFilename } from './gallery.js';
import { initMap, addPhotoMarker, clearMarkers, removeMarkerByFilename, setView } from './map.js';
import { registerServiceWorker, updateOnlineStatus } from './offline.js';
import { showStatusMessage } from './helper.js';

async function takePictureAndUpload() {
  const dataUrl = takePicture();

  // Validate image
  if (!isValidDataUrl(dataUrl)) {
    showStatusMessage("Invalid image data.", "error");
    return;
  }

  // Validate size (prevent huge Base64 uploads)
  if (!isReasonableImageSize(dataUrl, 5 * 1024 * 1024)) { // 5 MB limit
    showStatusMessage("Image is too large to upload.", "error");
    return;
  }

  let coords;
  try {
    coords = await getUserLocation();
  } catch (err) {
    showStatusMessage("Unable to get location.", "error");
    return;
  }

  // Validate coordinates
  if (!isValidCoordinates(coords)) {
    showStatusMessage("Invalid location data.", "error");
    return;
  }

  try {
    const result = await uploadPhoto(
      dataUrl,
      coords.latitude,
      coords.longitude
    );

    showStatusMessage("Photo uploaded!", "success");
    return result;

  } catch (error) {
    showStatusMessage("Upload failed.", "error");
  }
}
function isValidDataUrl(dataUrl) {
  return typeof dataUrl === "string" &&
    dataUrl.startsWith("data:image/") &&
    dataUrl.includes(";base64,");
}
function isReasonableImageSize(dataUrl, maxBytes) {
  if (!dataUrl) return false;

  // Approximate Base64 → binary size
  const base64String = dataUrl.split(",")[1];
  const byteLength = (base64String.length * 3) / 4;

  return byteLength <= maxBytes;
}
function isValidCoordinates(coords) {
  if (!coords) return false;

  const { latitude, longitude } = coords;

  const validLat = typeof latitude === "number" && latitude >= -90 && latitude <= 90;
  const validLon = typeof longitude === "number" && longitude >= -180 && longitude <= 180;

  return validLat && validLon;

}
async function loadSavedPhotos() {
  try {
    const photos = await fetchPhotos();
    clearMarkers();
    clearGallery();
    photos.forEach(photo => {
      addPhotoMarker(photo);
      addPhotoToGallery(photo);
    });
    //console.log(`✅ Loaded ${photos.length} photos from the database`);
    showStatusMessage(`Loaded ${photos.length} photos from the database.`, 'success');
  } catch (err) {
    //console.error('Failed to load saved photos:', err);
    showStatusMessage('Failed to load saved photos.', 'error');
  }
}

function wireUI() {
  setupCamera();
  if (startButton) startButton.addEventListener('click', async (ev) => {
    ev.preventDefault();
    await takePictureAndUpload();
  });

  const findBtn = document.querySelector('#find-me');
  const hideBtn = document.querySelector('#hide-button');
  if (findBtn) findBtn.addEventListener('click', geoFindMe);
  if (hideBtn) hideBtn.addEventListener('click', () => {
    document.querySelector('#status').textContent = 'Location hidden.';
    document.querySelector('#map-link').textContent = '';
  });

  const testButton = document.getElementById('test');
  if (testButton) testButton.addEventListener('click', () => alert('Testing method button clicked!'));

    const deleteBtn = document.getElementById('delete-button');
    const photoEl = document.getElementById('photo');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const currentSrc = photoEl.src;
        if (!currentSrc || currentSrc.includes('data:image/')) {
          clearPhoto();
          return;
        }
        try {
          const filename = currentSrc.split('/').pop();
          const ok = await deletePhoto(filename);
          if (ok) {

            removePhotoByFilename(filename);

            removeMarkerByFilename(filename);
            clearPhoto();
          } else {
            //alert('Failed to delete photo.');
            showStatusMessage('Failed to delete photo.', 'error');
          }
        } catch (err) {
          //console.error('Delete error:', err);
          showStatusMessage('Error occurred while deleting photo.', 'error');
        }
      });
    }
}
function setupGalleryButton() {
  const loadBtn = document.getElementById('load-gallery-button');
  const hideBtn = document.getElementById('hide-gallery-button');
  const galleryGrid = document.getElementById('gallery-grid');

  if (loadBtn) {
    loadBtn.addEventListener('click', async () => {
      clearGallery();
      await loadSavedPhotos();
      if (galleryGrid) galleryGrid.style.display = 'grid';
    });
  }

  if (hideBtn) {
    hideBtn.addEventListener('click', () => {
      if (galleryGrid) galleryGrid.style.display = 'none';
    });
  }
}
window.addEventListener('load', () => {
  initMap();
  wireUI();
  registerServiceWorker();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
  setupGalleryButton();
});

export { loadSavedPhotos };