/*
 * Offline support for the 换算 app. Scope: /convert/ only — the rest of the
 * site is never touched.
 *
 * - The page itself: network first (so updates arrive), cached copy offline.
 * - Built JS/CSS under /assets/ (file names contain a content hash):
 *   cache first, they never change.
 * - Exchange-rate API calls are not intercepted; the app keeps its own
 *   cached rates in localStorage.
 */

const CACHE = 'soma-convert-v1';
const SHELL = [
  '/convert/',
  '/convert/manifest.webmanifest',
  '/convert/icon-192.png',
  '/convert/icon-512.png',
  '/convert/apple-touch-icon.png',
];

async function precache() {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL);
  // Also cache the hashed JS/CSS the page references, so the very first
  // install already works offline.
  const response = await cache.match('/convert/');
  if (!response) return;
  const html = await response.text();
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
  await Promise.all(assets.map((url) => cache.add(url).catch(() => undefined)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('soma-convert-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put('/convert/', copy));
          }
          return response;
        })
        .catch(() => caches.match('/convert/'))
    );
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  if (url.pathname.startsWith('/convert/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
