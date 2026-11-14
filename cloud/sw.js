const CACHE = 'household-cloud-134351acd71d';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/CartesianChart-BvE2m3d5.js","./assets/Coupons-CfU0AI2q.js","./assets/Debts-DfwLlQoE.js","./assets/Energy-n1zWrTo9.js","./assets/Life-CaDAn8ST.js","./assets/Planning-9Ouz8h_9.js","./assets/Retirement-B7QT7Z2h.js","./assets/Spending-BDC2d6HL.js","./assets/Spending-C4d6Ljwc.css","./assets/TaxFace-aUC46MT1.js","./assets/TaxImportPage-tHkzI-w4.js","./assets/art-t6o5BooX.js","./assets/cache-BAnuDY53.css","./assets/cache-C2V9i-KQ.js","./assets/charts-BBPkl6T5.js","./assets/cloud-C6Ir-nkr.js","./assets/cloud-D9B-LyNS.css","./assets/common-CZb19vX_.js","./assets/components-EnveGVSY.js","./assets/confirm-BOW7KCrv.js","./assets/icons-XfT9jW1t.js","./assets/jsQR-DMfxOdIb.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/portfolio-BCrZrMN9.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/taxReport-YqtJ7NE1.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
const OFFLINE_ENTRY = './index.html';
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
    u.pathname.includes('/api/') ||
    u.pathname.includes('/auth/')
  )
    return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches
          .open(CACHE)
          .then((c) => c.match(new URL(OFFLINE_ENTRY, self.registration.scope).href)),
      ),
    );
    return;
  }
  if (URLS.has(u.href))
    event.respondWith(
      caches.open(CACHE).then(async (c) => (await c.match(event.request)) || fetch(event.request)),
    );
});
