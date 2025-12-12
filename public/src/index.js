import { setupCamera, takePicture, clearPhoto, startButton } from './camera.js';
import { getUserLocation, geoFindMe } from './location.js';
import { fetchPhotos, uploadPhoto, deletePhoto } from './api.js';
import { addPhotoToGallery, clearGallery, removePhotoByFilename } from './gallery.js';
import { initMap, addPhotoMarker, clearMarkers, removeMarkerByFilename } from './map.js';
import { registerServiceWorker, updateOnlineStatus } from './offline.js';
import { showStatusMessage, showLoading, hideLoading } from './helper.js';

// -----------------------
// Utility: promise timeout
// -----------------------
async function withTimeout(promise, ms, errorMessage = "Operation timed out") {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), ms);
  });

  try {
    const result = await Promise.race([promise, timeout]);
    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// -----------------------
// Safe API calls
// -----------------------
async function getUserLocationSafe() {
  return withTimeout(getUserLocation(), 10000, "Location request timed out");
}

async function fetchPhotosSafe() {
  return withTimeout(fetchPhotos(), 10000, "Fetching photos timed out");
}

async function deletePhotoSafe(filename) {
  return withTimeout(deletePhoto(filename), 10000, "Delete photo timed out");
}

// -----------------------
// Photo upload
// -----------------------
async function takePictureAndUpload() {
  const dataUrl = takePicture();

  if (!isValidDataUrl(dataUrl)) {
    showStatusMessage("Invalid image data.", "error");
    return;
  }

  if (!isReasonableImageSize(dataUrl, 5 * 1024 * 1024)) {
    showStatusMessage("Image is too large to upload.", "error");
    return;
  }

  showLoading("Uploading photo...");

  try {
    const coords = await getUserLocationSafe();
    if (!isValidCoordinates(coords)) {
      showStatusMessage("Invalid location data.", "error");
      return;
    }

    const result = await uploadPhoto(dataUrl, coords.latitude, coords.longitude);
    showStatusMessage("Photo uploaded!", "success");
    return result;

  } catch (err) {
    console.error("Upload error:", err);
    showStatusMessage(err.message || "Upload failed.", "error");

  } finally {
    hideLoading();
  }
}

// -----------------------
// Photo validation
// -----------------------
function isValidDataUrl(dataUrl) {
  return typeof dataUrl === "string" &&
    dataUrl.startsWith("data:image/") &&
    dataUrl.includes(";base64,");
}

function isReasonableImageSize(dataUrl, maxBytes) {
  if (!dataUrl) return false;
  const base64String = dataUrl.split(",")[1];
  const byteLength = (base64String.length * 3) / 4;
  return byteLength <= maxBytes;
}

function isValidCoordinates(coords) {
  if (!coords) return false;
  const { latitude, longitude } = coords;
  return typeof latitude === "number" && latitude >= -90 && latitude <= 90 &&
         typeof longitude === "number" && longitude >= -180 && longitude <= 180;
}

// -----------------------
// Load saved photos
// -----------------------
async function loadSavedPhotos() {
  showLoading("Loading photos...");
  try {
    const photos = await fetchPhotosSafe();
    clearMarkers();
    clearGallery();
    photos.forEach(photo => {
      addPhotoMarker(photo);
      addPhotoToGallery(photo);
    });
    showStatusMessage(`Loaded ${photos.length} photos from the database.`, 'success');

  } catch (err) {
    console.error("Load photos error:", err);
    showStatusMessage(err.message || "Failed to load photos.", "error");

  } finally {
    hideLoading();
  }
}

// -----------------------
// Wire UI
// -----------------------
function wireUI() {
  const findBtn = document.getElementById('find-me');
  const hideBtn = document.getElementById('hide-button');
  const statusEl = document.getElementById('status');
  const mapLinkEl = document.getElementById('map-link');
  const deleteBtn = document.getElementById('delete-button');
  const photoEl = document.getElementById('photo');

  setupCamera();
  if (startButton) {
    startButton.addEventListener('click', async (ev) => {
      ev.preventDefault();
      await takePictureAndUpload();
    });
  }

  if (findBtn) findBtn.addEventListener('click', geoFindMe);
  if (hideBtn) {
    hideBtn.addEventListener('click', () => {
      statusEl.textContent = 'Location hidden.';
      mapLinkEl.textContent = '';
    });
  }

  function getFilenameFromUrl(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname.split('/').pop().split('?')[0];
    } catch {
      return null;
    }
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const currentSrc = photoEl.src;

      if (!currentSrc || currentSrc.startsWith('data:image/')) {
        clearPhoto();
        return;
      }

      if (!confirm("Are you sure you want to delete this photo?")) return;

      const filename = getFilenameFromUrl(currentSrc);
      if (!filename) {
        showStatusMessage("Unable to determine filename for deletion.", "error");
        return;
      }

      showLoading("Deleting photo...");
      try {
        const ok = await deletePhotoSafe(filename);
        if (ok) {
          removePhotoByFilename(filename);
          removeMarkerByFilename(filename);
          clearPhoto();
          showStatusMessage("Photo deleted.", "success");
        } else {
          showStatusMessage("Failed to delete photo.", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        showStatusMessage(err.message || "Delete failed.", "error");
      } finally {
        hideLoading();
      }
    });
  }
}

// -----------------------
// Gallery buttons
// -----------------------
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

// -----------------------
// Window load
// -----------------------
window.addEventListener('load', () => {
  initMap();
  wireUI();
  registerServiceWorker();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
  setupGalleryButton();
  hideLoading();
});

export { loadSavedPhotos };
