// Service worker généré par build.js. Il ne met en cache que l'app et des blobs
// chiffrés. Les tuiles de carte, les polices et tout contenu déchiffré (blob: URLs
// créées en mémoire par la page) ne passent jamais par ici.
const VERSION = '454210923c28';
const FILES = ["./","assets/index-BVThy9fD.css","assets/index-CdpB4uE3.js","assets/johanne-BOaaWSeX.png","assets/johary-B76d3i-u.png","assets/layers-2x-Bpkbi35X.png","assets/layers-BWBAp2CZ.png","assets/marker-icon-hN30_KVU.png","b/598464ecfc54db505d5fa329.bin","icon-180.png","icon-192.png","icon-512.png","index.html","manifest.webmanifest","steps.enc.json"];
const CACHE = `app-${VERSION}`;

self.addEventListener('install', (event) => {
  // skipWaiting : une nouvelle version remplace tout de suite l'ancienne (sinon un appareil qui a déjà ouvert
  // le site continue de servir ses anciens fichiers, donc ses anciens codes, tant qu'un onglet reste ouvert).
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('app-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  const url = new URL(req.url);
  // Les données chiffrées et la page d'accueil : réseau d'abord (toujours à jour), cache en secours hors ligne.
  if (req.mode === 'navigate' || url.pathname.endsWith('/steps.enc.json')) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true, ignoreVary: true }).then((hit) => hit || caches.match('./') || Response.error())),
    );
    return;
  }
  event.respondWith(
    caches.match(req, { ignoreSearch: true, ignoreVary: true }).then(
      (hit) => hit || fetch(req).catch(() => (req.mode === 'navigate' ? caches.match('./') : Response.error())),
    ),
  );
});
