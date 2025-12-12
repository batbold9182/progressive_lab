const BASE = '';

async function fetchPhotos() {
  try {
    const res = await fetch(`${BASE}/photos`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    showStatusMessage('Failed to load photos.', 'error');
    throw error;
  }
}

async function uploadPhoto(imageDataUrl, lat, lon) {
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageDataUrl, lat, lon }),
  });

  if (!res.ok) throw new Error(`Upload failed: HTTP ${res.status}`);
  return res.json();
}

async function deletePhoto(filename) {
  try {
    const res = await fetch(`${BASE}/delete/${filename}`, { method: 'DELETE' });

    if (!res.ok) {
      throw new Error(`Delete failed: HTTP ${res.status}`);
    }

    showStatusMessage('Photo deleted.', 'success');
    return true;

  } catch (error) {
    showStatusMessage('Failed to delete photo.', 'error');
    return false;
  }
}

export { fetchPhotos, uploadPhoto, deletePhoto };
