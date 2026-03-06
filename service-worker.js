const CACHE_NAME = 'osts-v1';
const OFFLINE_URLS = [
  '/OSTS/',
  '/OSTS/index.html',
  '/OSTS/API/overview.html',
  '/OSTS/Pages/Legal/terms.html',
  '/OSTS/Pages/Legal/privacy.html',
  '/OSTS/Pages/Legal/license.html',
  'OSTS/API/Assets/Logo/OSTS_Logo-192X192.png',
  'OSTS/API/Assets/Logo/OSTS_Logo-512X512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
