/*
 * Service Worker - funcionamiento PWA sin conexión solo para los archivos UI.
 * La radio EN VIVO necesita Internet; jamás cachear audio ni metadatos.
 */
const CACHE_NAME = 'lvc-radio-ui-v5';
const STATIC_ASSETS = [
  './', './index.html', './assets/style.css', './assets/app.js',
  './config.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Zeno y redes sociales: red normal.
  // Preferimos archivos de red para que cambios en config.js se actualicen al publicar.
  event.respondWith(fetch(request).then(response => {
    if (response.ok && url.pathname.match(/\.(?:html|css|js|webmanifest|png)$/)) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request).then(cached => cached || caches.match('./index.html'))));
});
