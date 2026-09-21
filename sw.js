/* Rotina: service worker. Guarda o app pra abrir sem internet e pega versao nova quando tem rede. */
const VERSAO = 'rotina-v3.0.0';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.v1.png', './icon-512.v1.png', './icon-maskable-192.v1.png', './icon-maskable-512.v1.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // pagina: rede primeiro (pra pegar versao nova), cache se estiver sem internet
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(VERSAO).then((c) => c.put('./index.html', cp)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  // resto (fontes, icones, manifesto): cache primeiro, atualiza por tras
  e.respondWith(caches.match(req).then((hit) => {
    const rede = fetch(req).then((r) => { if (r && (r.ok || r.type === 'opaque')) caches.open(VERSAO).then((c) => c.put(req, r.clone())); return r; }).catch(() => hit);
    return hit || rede;
  }));
});
