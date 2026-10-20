const CACHE_NAME = 'lib-cache-v1';

// All local app shell files to cache
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './css/base.css',
    './css/glass.css',
    './css/themes.css',
    './css/links.css',
    './js/config.js',
    './js/themes.js',
    './js/storage.js',
    './js/icons.js',
    './js/app.js',
    './js/modals.js',
    './js/qr.js',
    './js/blocks.js',
    './js/settings.js'
];

// Install Event: Cache App Shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event: Cache-First for App Shell, Network-First for External resources
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // If it's a request for our local app shell files
    if (url.origin === location.origin && APP_SHELL.some(path => url.pathname.endsWith(path.replace('./', '/')))) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request);
            })
        );
    } else {
        // For external images, APIs, embeds: Network-first, fallback to cache
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    return networkResponse;
                })
                .catch(() => caches.match(event.request)) // Fallback if offline
        );
    }
});
