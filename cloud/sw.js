const CACHE = 'household-cloud-80ffdbe8a1c8';
const FILES = ["./index.html","./manifest.webmanifest","./assets/CartesianChart-CxxStd9s.js","./assets/Coupons-C33SnApC.js","./assets/Debts-BKhCPAb2.js","./assets/Energy-D9iRrOcl.js","./assets/Life-BIJiVsjt.js","./assets/Planning-BwwlYUmC.js","./assets/Retirement-BRmNvKve.js","./assets/Spending-B8iBnMvV.css","./assets/Spending-BJ-zyEVh.js","./assets/TaxFace-B7SevGCb.js","./assets/art-ACfd6HSw.js","./assets/charts-DHZ0UUpM.js","./assets/cloud-ATMU9ZuW.css","./assets/cloud-BqEiOXSZ.js","./assets/common-DjDi6FrH.js","./assets/confirm-Bq8pm4wW.js","./assets/context-CvsZ6axS.js","./assets/energy-BimfAHq3.js","./assets/jsQR-DMfxOdIb.js","./assets/model-CoaSMNjm.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-B65aBcE7.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/spending-Bn7ZSpNS.js","./assets/wallet-Wdce0t9y.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
const URLS = new Set(FILES.map((p) => new URL(p, self.registration.scope).href));
self.addEventListener('install', (event) =>
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))),
);
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  const u = new URL(event.request.url);
  if (
    u.origin !== self.location.origin ||
    event.request.method !== 'GET' ||
    u.pathname.includes('/api/')
  )
    return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches
          .open(CACHE)
          .then((c) => c.match(new URL('./index.html', self.registration.scope).href)),
      ),
    );
    return;
  }
  if (URLS.has(u.href))
    event.respondWith(
      caches.open(CACHE).then(async (c) => (await c.match(event.request)) || fetch(event.request)),
    );
});
