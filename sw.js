// Prima la rete (così ricevi sempre la versione aggiornata). Se la rete non c'è
// o l'indirizzo non risponde più (es. 404), usa la copia salvata sul telefono.
const CACHE = 'spese-v1';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
const fromCache = req => caches.match(req).then(r => r || caches.match('./index.html'));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (!r.ok) return fromCache(e.request).then(c => c || r);
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => fromCache(e.request))
  );
});
