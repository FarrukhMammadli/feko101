const CACHE_NAME = 'feko101-v3';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './icon.png',
  './manifest.json',
  './sw.js'
];

// Install: Bütün faylları keşlə
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Köhnə keşləri sil
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Əvvəlcə keş, sonra network (Offline-first)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Yalnız GET sorğularını keşlə
        if (e.request.method !== 'GET') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => {
        // Offline olduqda index.html qaytar
        if (e.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
