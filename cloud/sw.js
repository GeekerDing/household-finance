const CACHE = 'household-cloud-59c03a375c33';
const FILES = ["./index.html","./manifest.webmanifest","./assets/CartesianChart-DhdkDP5p.js","./assets/Coupons-BYRvsLMl.js","./assets/Debts-xEX8ZWKh.js","./assets/Energy-D8_IH8Fd.js","./assets/Life-CPljnn_a.js","./assets/Planning-7zqY3JbN.js","./assets/Retirement-Cxa6iVrY.js","./assets/Spending-CBuibbw-.css","./assets/Spending-GlQIKDxd.js","./assets/TaxFace-BZd66_tQ.js","./assets/art-ACfd6HSw.js","./assets/charts-BYmF7EY9.js","./assets/cloud-3RnaZvQ5.js","./assets/cloud-9w8Orlmk.css","./assets/common-R3XXBJYo.js","./assets/confirm-7-C6qrP0.js","./assets/context-CvsZ6axS.js","./assets/energy-BimfAHq3.js","./assets/jsQR-DMfxOdIb.js","./assets/model-6F-ATQyg.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-DQjtYiNb.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/spending-Bn7ZSpNS.js","./assets/wallet-DTQqxOm0.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
