const CACHE_NAME = 'ics-cache-v1';
const urlsToCache = [
  '/instagram-carousel-splitter/',
  '/instagram-carousel-splitter/index.html',
  '/instagram-carousel-splitter/assets/css/style.css',
  '/instagram-carousel-splitter/assets/js/main.js',
  '/instagram-carousel-splitter/assets/js/libs/jszip.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});