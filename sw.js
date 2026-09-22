/* Acopiara — cartografia.
   Páginas: rede primeiro, cópia só sem internet.
   Em segundo plano: guarda todas as páginas do aplicativo para uso offline.
   Fundos de mapa: guarda os ladrilhos já vistos, até um limite. */
const VERSAO = 'acopiara-v4';
const LADRILHOS = 'acopiara-ladrilhos';
const LIMITE_LADRILHOS = 3000;
const HOSTS_MAPA = ['server.arcgisonline.com', 'tile.openstreetmap.org', 'basemaps.cartocdn.com'];

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSAO && k !== LADRILHOS).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('message', e => {
  if (!e.data || e.data.tipo !== 'guardar') return;
  const b = e.data.base;
  const lista = ['', 'index.html', 'painel/', 'planta/', 'quadrantes/', 'manifest.webmanifest',
    'icons/icon.svg', 'icons/favicon.ico', 'icons/icon-192.png', 'icons/icon-512.png',
    'icons/apple-touch-icon.png', 'browserconfig.xml'].map(p => b + p);
  e.waitUntil(caches.open(VERSAO).then(c => Promise.all(lista.map(u =>
    fetch(u, { cache: 'no-store' }).then(r => { if (r.ok) return c.put(u, r); }).catch(() => {}))))
    .then(() => self.clients.matchAll().then(cs => cs.forEach(cl => cl.postMessage({ tipo: 'offline-pronto' })))));
});
async function aparaLadrilhos(c) {
  const ks = await c.keys();
  if (ks.length > LIMITE_LADRILHOS) await Promise.all(ks.slice(0, ks.length - LIMITE_LADRILHOS).map(k => c.delete(k)));
}
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (HOSTS_MAPA.includes(url.hostname)) {
    e.respondWith(caches.open(LADRILHOS).then(c => c.match(req).then(hit => hit || fetch(req).then(resp => {
      if (resp && (resp.ok || resp.type === 'opaque')) { c.put(req, resp.clone()).then(() => aparaLadrilhos(c)); }
      return resp;
    }))));
    return;
  }
  if (url.origin !== location.origin) return;
  const pagina = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (pagina) {
    e.respondWith(fetch(req, { cache: 'no-store' }).then(resp => {
      if (resp && resp.ok) { const c = resp.clone(); caches.open(VERSAO).then(k => k.put(req, c)); }
      return resp;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(h => h || caches.match(new URL('./index.html', self.registration.scope).href))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const rede = fetch(req).then(resp => {
      if (resp && resp.ok && resp.type === 'basic') { const c = resp.clone(); caches.open(VERSAO).then(k => k.put(req, c)); }
      return resp;
    }).catch(() => hit);
    return hit || rede;
  }));
});
