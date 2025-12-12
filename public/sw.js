const CACHE_NAME = 'progressive_lab_v5.6';

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/src/index.js',
  '/src/api.js',
  '/src/gallery.js',
  '/src/map.js',
  '/src/camera.js',
  '/src/location.js',
  '/src/offline.js',
  '/src/helper.js',
  '/manifest.json',
  '/pictures/logo-192x192.png',
  '/pictures/logo-192x192-maskable.png',
  '/pictures/logo-512x512.png',
  '/pictures/logo-512x512-maskable.png',
  '/pictures/logo.png',
  '/pictures/screenshot-desktop.jpg',
  '/pictures/screenshot-mobile.jpg'
];

// API routes that must NOT be cached or intercepted
const API_PATHS = [
  '/photos',
  '/upload',
  '/delete'
];

/* -------------------------------------------------
   INSTALL
--------------------------------------------------- */
self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(urlsToCache);
      } catch (err) {
        console.warn('cache.addAll failed — falling back to manual caching', err);

        await Promise.all(
          urlsToCache.map(async (url) => {
            try {
              const res = await fetch(url);
              if (res.ok) cache.put(url, res.clone());
            } catch (e) {
              console.warn('Failed to cache:', url, e);
            }
          })
        );
      }
    })
  );
});

/* -------------------------------------------------
   FETCH
--------------------------------------------------- */
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // ---- 1. BYPASS all API requests ----
  if (API_PATHS.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(fetch(request));
    return;
  }

  // ---- 2. Only handle same-origin GET requests ----
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return; // don't touch it
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }

          return networkResponse;
        })
        .catch(() => {
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

/* -------------------------------------------------
   ACTIVATE
--------------------------------------------------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});
