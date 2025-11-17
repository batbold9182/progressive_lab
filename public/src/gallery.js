
const galleryGrid = document.getElementById('gallery-grid');

function clearGallery() {
  galleryGrid.innerHTML = '';
}

function addPhotoToGallery(photoEntry) {
  const img = document.createElement('img');
  img.src = photoEntry.imageUrl;
  img.alt = `Photo taken at ${new Date(photoEntry.timestamp).toLocaleString()}`;

  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.classList.add('gallery-overlay');

    const content = document.createElement('div');
    content.style.maxWidth = '96%';
    content.style.textAlign = 'center';

    const largeImg = document.createElement('img');
    largeImg.src = img.src;
    largeImg.alt = img.alt;

    const meta = document.createElement('div');
    meta.style.marginTop = '12px';
    meta.style.color = '#fff';
    meta.style.fontSize = '14px';

    const dateP = document.createElement('p');
    dateP.style.margin = '6px 0';
    dateP.textContent = `Taken: ${new Date(photoEntry.timestamp).toLocaleString()}`;
    meta.appendChild(dateP);

    if (photoEntry.lat !== undefined && photoEntry.lon !== undefined) {
      const locLink = document.createElement('a');
      locLink.href = `https://www.openstreetmap.org/#map=18/${photoEntry.lat}/${photoEntry.lon}`;
      locLink.textContent = `View location: ${photoEntry.lat.toFixed(5)}, ${photoEntry.lon.toFixed(5)}`;
      locLink.target = '_blank';
      locLink.rel = 'noopener noreferrer';
      locLink.style.color = '#fff';
      locLink.style.textDecoration = 'underline';
      meta.appendChild(locLink);
    } else {
      const noLoc = document.createElement('p');
      noLoc.style.margin = '6px 0';
      noLoc.textContent = 'Location not available';
      meta.appendChild(noLoc);
    }

    content.appendChild(largeImg);
    content.appendChild(meta);
    overlay.appendChild(content);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  });

  galleryGrid.appendChild(img);
}

function removePhotoByFilename(filename) {
  const galleryImg = [...galleryGrid.querySelectorAll('img')].find(i => i.src.endsWith(filename));
  if (galleryImg) galleryImg.remove();
}

export { addPhotoToGallery, clearGallery, removePhotoByFilename };
