const CACHE_NAME = 'progressive_lab_v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
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
    self.skipWaiting(); // activate worker immediately
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch - cache-first for same-origin, network-only for external resources
self.addEventListener('fetch', event => {
    // Only handle same-origin requests
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request)
                    .then(fetchResponse => {
                        // Only cache valid same-origin responses
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }
                        const responseToCache = fetchResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
                        return fetchResponse;
                    })
                ).catch(() => {
                    // Optional: fallback for offline requests
                    if (event.request.destination === 'document') {
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
