/* Acopiara — cartografia. Cache do casco e das páginas visitadas, para uso offline. */
const VERSAO = 'acopiara-v1';
const CASCO = ['./', './index.html', './manifest.webmanifest',
  './icons/icon.svg', './icons/favicon.ico', './icons/icon-192.png', './icons/icon-512.png',
  './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(CASCO)).then(() => self.skipWaiting()).catch(() => {}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;            // ladrilhos e fontes seguem pela rede
  e.respondWith(
    caches.match(req).then(hit => {
      const rede = fetch(req).then(resp => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const copia = resp.clone();
          caches.open(VERSAO).then(c => c.put(req, copia)).catch(() => {});
        }
        return resp;
      }).catch(() => hit);
      return hit || rede;
    })
  );
});
