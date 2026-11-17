const CACHE = 'household-cloud-20bd26849842';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/CartesianChart-CQEyvfT2.js","./assets/Coupons-CsxW_YwN.js","./assets/Debts-Cfmyud3g.js","./assets/Energy-CV8zbQsX.js","./assets/Life-DBO369nH.js","./assets/Planning-AIj-Jk_C.js","./assets/RecordForm-BEU5XThp.js","./assets/Retirement-DsXKON8a.js","./assets/Spending-DOEO7tKz.css","./assets/Spending-a1RZWvih.js","./assets/TaxFace-CQGMD5L7.js","./assets/TaxImportPage-B1AuA9i9.js","./assets/art-t6o5BooX.js","./assets/cache-B3JqouoB.js","./assets/cache-BAnuDY53.css","./assets/charts-Bn_g5RXG.js","./assets/cloud-BT0PzBS4.css","./assets/cloud-C1M80AnW.js","./assets/common-Kk77hxon.js","./assets/components-B0PsaaOL.js","./assets/confirm-jMPygkIi.js","./assets/icons-CRW9OYoU.js","./assets/jsQR-DMfxOdIb.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/portfolio-CtCGZk8N.js","./assets/rolldown-runtime-XKyaHtl9.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
