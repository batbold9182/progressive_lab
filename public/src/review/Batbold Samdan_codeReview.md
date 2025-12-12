# HTML

#### 1. **Incorrect section structure - missing opening `<section>` tag**
- **Location**: `index.html`, lines 38-41
- **Code with error**:
```html
<main>
    <h2>Map</h2>
    <div id="map" style="height: 300px; width: 100%; border-radius: 10px;"></div>
  </section>  <!-- ❌ Closing tag without opening tag -->
```
- **💡 Explanation**: 
  - Missing opening `<section>` tag for the map section
  - The closing tag `</section>` on line 41 has no corresponding opening tag
  - This causes HTML5 validation errors and may lead to DOM parsing issues
  - Screen readers may have problems navigating the page structure

---

#### 2. **Duplicate `<link rel="icon">` tag**
- **Location**: `index.html`, lines 17 and 20
- **Code with error**:
```html
<link rel="icon" href="/pictures/logo-192x192.png" type="image/png">
<!-- ... -->
<link rel="icon" href="/favicon.ico" type="image/x-icon">
```
- **💡 Explanation**: 
  - Two different favicons are defined - the browser will only use the first one
  - The second link is ignored, wasting resources
  - There should be only one favicon or use different sizes in a single tag

---

#### 3. **Missing meta description for SEO**
- **Location**: `index.html`, `<head>` section
- **Code with error**: Missing `<meta name="description">` tag
- **💡 Explanation**: 
  - Meta description is crucial for SEO and search result display
  - Without it, browsers and search engines have no description of the application
  - Negatively impacts CTR in search results
  - Required for PWA to be better indexed

---

#### 4. **Missing `defer` or `async` attribute for external script**
- **Location**: `index.html`, line 90
- **Code with error**:
```html
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```
- **💡 Explanation**: 
  - Script loads synchronously, blocking HTML parsing
  - Slows down First Contentful Paint (FCP) and Time to Interactive (TTI)
  - Leaflet doesn't need to be loaded before page rendering
  - Can be loaded asynchronously or with defer

---

#### 5. **Inline style instead of CSS class**
- **Location**: `index.html`, line 40
- **Code with error**:
```html
<div id="map" style="height: 300px; width: 100%; border-radius: 10px;"></div>
```
- **💡 Explanation**: 
  - Inline styles make maintenance and style modification difficult
  - Cannot be overridden by media queries (responsiveness)
  - Increases HTML size
  - Violates the principle of separation of content and presentation

---

# CSS

#### 1. **Lack of responsiveness - no media queries**
- **Location**: `style.css`, entire file
- **Code with error**: No media queries at all
- **💡 Explanation**: 
  - Application is not responsive - doesn't adapt to different screen sizes
  - On small screens (mobile), elements may be too large or too small
  - Logo 150px height may be too large on mobile
  - Gallery grid with minmax(150px, 1fr) may be problematic on small screens
  - Lack of mobile-first approach - application is not optimized for mobile devices
  - PWA should work great on mobile, but currently may have UX issues

---

#### 2. **Incorrect use of `will-change` - may cause performance issues**
- **Location**: `style.css`, line 20
- **Code with error**:
```css
.logo {
  will-change: transform;
  animation: spin 5s linear infinite;
}
```
- **💡 Explanation**: 
  - `will-change` should only be used when an element will be animated in the future
  - For continuous animations, `will-change` may cause increased memory usage
  - Browsers already optimize CSS animations, `will-change` may be unnecessary
  - May lead to memory leaks if not properly managed

---

#### 3. **Incomplete transition property - missing property specification**
- **Location**: `style.css`, lines 55, 81, 107
- **Code with error**:
```css
.button-primary, .button-btn {
  transition: 0.2s; /* ❌ Missing property */
}

#offline-banner {
  transition: opacity 0.3s ease; /* ✅ OK */
}

#gallery-grid img {
  transition: transform 0.2s ease; /* ✅ OK */
}
```
- **💡 Explanation**: 
  - `transition: 0.2s` without property means transition for all properties
  - May cause unexpected animations when other properties change
  - Should be `transition: background-color 0.2s` for precision
  - Affects performance - animates more than necessary

---

#### 4. **Redundant width property in offline-banner**
- **Location**: `style.css`, lines 66-84
- **Code with error**:
```css
#offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%; /* ❌ Redundant - left: 0 + right: 0 already sets width */
}
```
- **💡 Explanation**: 
  - `left: 0` + `right: 0` on `position: fixed` already sets width to 100%
  - `width: 100%` is redundant and may cause issues in some cases
  - May lead to overflow issues

---

#### 5. **Duplicate font-family - unnecessary override**
- **Location**: `style.css`, lines 2, 80
- **Code with error**:
```css
body {
  font-family: Arial, sans-serif; /* ✅ OK */
}

#offline-banner {
  font-family: Arial, sans-serif; /* ❌ Redundant - inherits from body */
}
```
- **💡 Explanation**: 
  - `#offline-banner` inherits `font-family` from `body`
  - Redundant override increases CSS size without benefits
  - May be confusing during code maintenance

---

#### 6. **Missing overflow handling for containers**
- **Location**: `style.css`, various places
- **Code with error**: Missing `overflow` properties for containers
- **💡 Explanation**: 
  - Lack of overflow control may lead to layout issues
  - Long texts may overflow containers
  - Gallery images may cause overflow
  - May lead to horizontal scroll on mobile

---

#### 7. **Missing min-height for video/canvas - may cause layout shift**
- **Location**: `style.css`, lines 37-41
- **Code with error**:
```css
.camera video {
  width: 100%;
  border-radius: 10px;
  background-color: #000;
}
/* ❌ Missing min-height - may cause CLS (Cumulative Layout Shift) */
```
- **💡 Explanation**: 
  - Missing `min-height` may cause layout shift when video loads
  - Negatively impacts CLS (Cumulative Layout Shift) - important Lighthouse metric
  - May lead to poor UX - elements "jump" during loading

---

#### 8. **Missing disabled states for buttons**
- **Location**: `style.css`, lines 47-60
- **Code with error**: Missing styles for `:disabled` state
- **💡 Explanation**: 
  - Buttons may be disabled during async operations (upload, fetch)
  - Lack of visual information about disabled state leads to poor UX
  - Users may try to click disabled button multiple times

---


#### 9. **Missing CSS Custom Properties (CSS Variables)**
- **Location**: `style.css`, entire file
- **Code with error**: Hardcoded color values, sizes, etc.
- **💡 Explanation**: 
  - CSS Variables make maintenance and theming easier
  - Ability to easily change colors, sizes in one place
  - Better code organization

---

#### 10. **Missing methodology organization (BEM, SMACSS)**
- **Location**: `style.css`, entire file
- **Code with error**: Mixed class naming (kebab-case, but without structure)
- **💡 Explanation**: 
  - Lack of consistent methodology makes maintenance difficult
  - Harder to find related styles
  - May lead to naming conflicts
  - Lack of modularity

---

#### 11. **Missing loading states and error states**
- **Location**: `style.css`, entire file
- **Code with error**: Missing styles for loading/error states
- **💡 Explanation**: 
  - Lack of visual information about loading state
  - Missing styles for errors (e.g., upload error)
  - May lead to poor UX

---

# JavaScript


#### 1. **Missing error handling in async functions - may lead to crashes**
- **Location**: `src/api.js`, lines 3-6, 9-15, 18-21
- **Code with error**:
```javascript
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
  return res.json(); // ❌ Missing res.ok check
}

async function deletePhoto(filename) {
  const res = await fetch(`${BASE}/delete/${filename}`, { method: 'DELETE' });
  return res.ok; // ❌ Missing network error handling
}
```
- **💡 Explanation**: 
  - `uploadPhoto` and `deletePhoto` don't check `res.ok` before calling `res.json()`
  - If server returns an error (4xx, 5xx), `res.json()` may throw an exception
  - Missing try-catch in functions may lead to unhandled promise rejections
  - Network errors (offline, timeout) are not handled
  - May lead to application crashes

---

#### 2. **Potential XSS Vulnerability in map.js**
- **Location**: `src/map.js`, lines 13-19  
- **Code with error**:
```javascript
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
```
- **💡 Explanation**: 
  - Template literals are used to insert data into HTML
  - Data comes from server, where imageUrl is generated as `http://localhost:3000/uploads/photo_${Date.now()}.png`
  - Lat/lon are numbers from MongoDB, timestamp is ISO string
  - Leaflet.bindPopup() may have its own sanitization, but it's better to be safe
  - Theoretically possible XSS if database data were modified

---

#### 3. **Missing input validation before sending to server**
- **Location**: `src/index.js`, lines 8-26, `src/api.js`, lines 9-15
- **Code with error**:
```javascript
async function takePictureAndUpload() {
  const dataUrl = takePicture();
  if (!dataUrl) return;

  const coords = await getUserLocation();
  // ❌ Missing coords validation
  // ❌ Missing dataUrl validation (may be too large)

  try {
    const result = await uploadPhoto(dataUrl, coords.latitude, coords.longitude);
    // ...
  }
}
```
- **💡 Explanation**: 
  - Missing coordinate validation (may be NaN, null, undefined, out of range)
  - Missing `dataUrl` format validation (may not be a valid data URL)
  - May lead to server errors, memory issues, crashes

---

#### 4. **Potential Memory Leak - missing camera stream cleanup**
- **Location**: `src/camera.js`, lines 40-52
- **Code with error**:
```javascript
function setupCamera() {
  allowButton.addEventListener('click', () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        // ⚠️ Missing cleanup of previous stream if exists
      })
      .catch((err) => {
        console.error('Camera error:', err);
        alert('Unable to access camera. Check permissions.');
      });
  });
  // ...
}
```
- **💡 Explanation**: 
  - If user clicks "Allow Camera" multiple times, previous stream may remain active
  - MediaStream tracks should be stopped before creating a new stream
  - Event listener is added only once (setupCamera called once on startup)
  - Not a critical memory leak, but good practice is to clean up streams

---


#### 5. **Using `==` instead of `===` - may lead to logical errors**
- **Location**: `src/map.js`, line 12
- **Code with error**:
```javascript
if (entry.lat == null || entry.lon == null) return;
```
- **💡 Explanation**: 
  - `==` performs type coercion, which may lead to unexpected results
  - `===` is more precise and safer
  - Best practice in JavaScript - always use `===` and `!==`
  - May mask errors

---

#### 6. **Missing debouncing/throttling for event handlers - may lead to performance issues**
- **Location**: `src/gallery.js`, line 13, `src/map.js` (potentially)
- **Code with error**:
```javascript
img.addEventListener('click', () => {
  // Creating overlay - may be called multiple times quickly
  const overlay = document.createElement('div');
  // ...
});
```
- **💡 Explanation**: 
  - Missing debouncing may lead to multiple function calls
  - In case of rapid clicks, may create multiple overlays
  - May lead to memory and performance issues

---

#### 7. **Missing API availability check before use**
- **Location**: `src/location.js`, line 3, `src/camera.js`, line 42, `src/offline.js`, line 33
- **Code with error**:
```javascript
async function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: 0, longitude: 0 }); // ❌ Returns invalid data instead of error
      return;
    }
    // ...
  });
}

// In camera.js:
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  // ❌ Missing check if mediaDevices exists
```
- **💡 Explanation**: 
  - Missing check for `navigator.mediaDevices` before use may lead to errors
  - Returning `{ latitude: 0, longitude: 0 }` instead of error masks the problem
  - User doesn't know the function isn't working
  - May lead to uploading photos with incorrect location

---

#### 8. **Missing validation before deleting photo**
- **Location**: `src/index.js`, lines 64-86
- **Code with error**:
```javascript
deleteBtn.addEventListener('click', async (ev) => {
  ev.preventDefault();
  const currentSrc = photoEl.src;
  if (!currentSrc || currentSrc.includes('data:image/png;base64')) {
    clearPhoto();
    return;
  }
  try {
    const filename = currentSrc.split('/').pop(); // ❌ May be incorrect
    const ok = await deletePhoto(filename);
    // ...
  }
});
```
- **💡 Explanation**: 
  - `split('/').pop()` may return incorrect filename
  - Missing confirmation before deletion (UX)
  - Missing validation if filename is safe

---

#### 10. **Missing optimization - multiple querySelector calls**
- **Location**: `src/index.js`, `src/gallery.js`, various places
- **Code with error**:
```javascript
const findBtn = document.querySelector('#find-me');
const hideBtn = document.querySelector('#hide-button');
// ...
document.querySelector('#status').textContent = 'Location hidden.';
document.querySelector('#map-link').textContent = '';
```
- **💡 Explanation**: 
  - Multiple `querySelector` calls for the same elements
  - Can cache element references
  - Improves performance (fewer DOM queries)

---

#### 11. **Missing loading states in UI**
- **Location**: `src/index.js`, `src/api.js`
- **Code with error**: Missing visual loading indicators
- **💡 Explanation**: 
  - User doesn't know an operation is in progress
  - May lead to multiple clicks
  - Poor UX

---

# PWA

#### 1. **Path inconsistency** ####
- **Location**: manifest.json
- **Code with error**:
```javascript
"start_url": "./index.html",  // relative
"icons": [
  { "src": "/pictures/logo-192x192.png" }  // absolute
]
```
- **💡 Explanation**: 
  * Mixing relative (`./`) and absolute (`/`) paths may cause resource resolution issues
  * Relative path `./index.html` is resolved relative to manifest.json location
  * Absolute path `/pictures/logo.png` is resolved relative to domain root directory
  * If application is hosted in a subdirectory (e.g., `example.com/app/`), absolute paths will look for resources in the wrong place (`example.com/pictures/` instead of `example.com/app/pictures/`)
  * Inconsistent conventions make code maintenance difficult and may lead to 404 errors in different environments (dev, staging, production)
  * Service Worker may not find all resources to cache, causing incomplete PWA installation

---

#### 2. **Missing filtering of dynamic API calls** ####
- **Location**: sw.js
- **Code with error**:
```javascript
event.respondWith(
  caches.match(request)
    .then(response => response || fetch(request)
      .then(fetchResponse => {
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }
        // Caches EVERYTHING that returns status 200
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
        return fetchResponse;
      })
    )
);
```
- **💡 Explanation**: 
  * Service Worker caches ALL successful responses (status 200), including dynamic API data
  * User may see outdated data (stale prices, old cart state, outdated posts)
  * Missing distinction between static resources (CSS, JS, images) and dynamic JSON data
  * May lead to "cache poisoning" - incorrect API data stays in cache for a long time
  * Increases cache size with unnecessary data that should always be fresh
  * User won't get data updates even when online
  * Particularly problematic for POST/PUT/DELETE requests, which may be cached even though they shouldn't
  * Missing cache strategy (e.g., network-first for API, cache-first for assets)

---

#### 3. **Incomplete error handling in activate** ####
- **Location**: sw.js, 'activate' event listener, line ~75
- **Code with error**:
```javascript
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});
```
- **💡 Explanation**: 
  * Missing try-catch or .catch() means errors are ignored without logging
  * If old cache deletion fails, developer won't know about it
  * Array.map() also returns `undefined` for elements that don't meet the condition (when cacheName === CACHE_NAME)
  * Promise.all() with undefined in array may lead to unpredictable behavior
  * Missing feedback on whether activation succeeded
  * In case of network error or IndexedDB issues, old caches may remain and occupy memory
  * More difficult debugging - developer doesn't know if problem is in install or activate
  * Service Worker may activate in incomplete state, affecting application functionality

