const CACHE_NAME = 'lib-cache-v10'; // Bumped to v10!

const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './css/base.css',
    './css/glass.css',
    './css/themes.css',
    './css/links.css',
    './css/widgets.css',
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

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((cache) => { if (cache !== CACHE_NAME) return caches.delete(cache); }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.origin === location.origin && APP_SHELL.some(path => url.pathname.endsWith(path.replace('./', '/')))) {
        event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
    } else {
        event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    }
});
