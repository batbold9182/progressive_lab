import { setupCamera, takePicture, clearPhoto, startButton } from './camera.js';
import { getUserLocation, geoFindMe } from './location.js';
import { fetchPhotos, uploadPhoto, deletePhoto } from './api.js';
import { addPhotoToGallery, clearGallery, removePhotoByFilename } from './gallery.js';
import { initMap, addPhotoMarker, clearMarkers, removeMarkerByFilename, setView } from './map.js';
import { registerServiceWorker, updateOnlineStatus } from './offline.js';
import { showStatusMessage } from './helper.js';

async function takePictureAndUpload() {
  const dataUrl = takePicture();
  if (!dataUrl) return;

  const coords = await getUserLocation();

  try {
    const result = await uploadPhoto(dataUrl, coords.latitude, coords.longitude);
    if (result.success) {
      addPhotoMarker(result.entry);
      setView(coords.latitude, coords.longitude, 16);
    } else {
      //alert('Upload failed.');
      showStatusMessage('Photo upload failed.', 'error');
    }
  } catch (err) {
    console.error('Upload error:', err);
    //alert('Failed to upload photo.');
    showStatusMessage('Failed to upload photo.', 'error');
  }
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
        if (!currentSrc || currentSrc.includes('data:image/png;base64')) {
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