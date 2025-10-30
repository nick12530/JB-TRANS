self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Optional: basic offline fallback for root
self.addEventListener('fetch', (event) => {
  // Network first, no aggressive caching by default to avoid stale data during dev
});


