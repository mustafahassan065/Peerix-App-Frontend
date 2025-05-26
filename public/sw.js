const CACHE_NAME = 'peerix-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  // add more static assets if needed
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
