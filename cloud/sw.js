const CACHE = 'household-cloud-7183f54ae310';
const FILES = ["./index.html","./manifest.webmanifest","./assets/CartesianChart-C318VRyI.js","./assets/Coupons-CKp2ByC2.js","./assets/Debts-DOfJgsgi.js","./assets/Energy-DTAzG73V.js","./assets/Life-Boka4gb1.js","./assets/Planning-1Zs0fU4t.js","./assets/Retirement-C6y5mHFK.js","./assets/Spending-BKPa32i7.css","./assets/Spending-D9-Hsubw.js","./assets/TaxFace-BjswM6xk.js","./assets/TaxImportPage-DI_kAK9o.js","./assets/art-ACfd6HSw.js","./assets/cache-Bt2Zez1W.css","./assets/cache-DpUXgGKX.js","./assets/charts-D6juVHef.js","./assets/cloud-BPhqMeFn.css","./assets/cloud-C6nOrYSP.js","./assets/common-CAersfRh.js","./assets/components-ojRx7QT4.js","./assets/energy-Dig3ltG5.js","./assets/jsQR-DMfxOdIb.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-CGBpyH4N.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/spending-mZNcukN6.js","./assets/wallet-DC8mYaNT.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
const URLS = new Set(FILES.map((p) => new URL(p, self.registration.scope).href));
self.addEventListener('install', (event) =>
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))),
);
// 新版本激活后删除旧版本的程序缓存，避免每次发布都多占一份存储（与加密金库共用配额）
self.addEventListener('activate', (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('household-cloud-') && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
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
