const CACHE_NAME = 'progressive_lab_v4.1';
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
  '/manifest.json',
  '/sw.js',
  '/pictures/logo-192x192.png',
  '/pictures/logo-192x192-maskable.png',
  '/pictures/logo-512x512.png',
  '/pictures/logo-512x512-maskable.png',
  '/pictures/logo.png',
  '/pictures/screenshot-desktop.jpg',
  '/pictures/screenshot-mobile.jpg'
];

// Install - caching essential files
self.addEventListener('install', event => {
  // Activate worker immediately
  self.skipWaiting();

  // Try to cache the listed resources. If some resources fail (404, etc.),
  // don't fail the whole install — instead cache what we can.
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        // cache.addAll will reject if any request fails; try it first for speed
        await cache.addAll(urlsToCache);
      } catch (err) {
        // Fallback: attempt to fetch & put each resource individually and ignore failures
        console.warn('Some resources failed to cache with cache.addAll(), falling back to individual caching.', err);
        await Promise.all(urlsToCache.map(async (url) => {
          try {
            const res = await fetch(url);
            if (res && res.ok) {
              await cache.put(url, res.clone());
            }
          } catch (e) {
            // ignore individual failures
            console.warn('Failed to cache', url, e);
          }
        }));
      }
    })
  );
});

// Fetch - cache-first for same-origin, network-only for external resources
self.addEventListener('fetch', event => {
  const request = event.request;

  // Only handle same-origin GET requests
  if (request.url.startsWith(self.location.origin) && request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request)
          .then(fetchResponse => {
            // Only cache valid same-origin responses
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
            return fetchResponse;
          })
        ).catch(() => {
          // Optional: fallback for offline documents
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        })
    );
  }
  // External requests go directly to network
});


// Activate - clean up old caches
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
        }).then(() => self.clients.claim()) // take control immediately
    );
});
