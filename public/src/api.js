const BASE = '';

async function fetchPhotos() {
  const res = await fetch(`${BASE}/photos`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function uploadPhoto(imageDataUrl, lat, lon) {
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageDataUrl, lat, lon }),
  });
  return res.json();
}

async function deletePhoto(filename) {
  const res = await fetch(`${BASE}/delete/${filename}`, { method: 'DELETE' });
  return res.ok;
}

export { fetchPhotos, uploadPhoto, deletePhoto };
