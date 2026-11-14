const CACHE = 'household-cloud-e4e8a2245c54';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/CartesianChart-CqGtMcew.js","./assets/Coupons-D0Nwym6o.js","./assets/Debts-CmtyDwWG.js","./assets/Energy-D7KmCPWy.js","./assets/Life-BwzrTfG7.js","./assets/Planning-Cfjr-DFT.js","./assets/Retirement-o-IL78Xt.js","./assets/Spending-C4d6Ljwc.css","./assets/Spending-DwfCsU6v.js","./assets/TaxFace-C-dvs2da.js","./assets/TaxImportPage-B8bg3f-5.js","./assets/art-t6o5BooX.js","./assets/cache-BAnuDY53.css","./assets/cache-DEFEcyuw.js","./assets/charts-BWxNRimM.js","./assets/cloud-Czi24IMT.css","./assets/cloud-Dbe4DXNL.js","./assets/common-DYAEZ1Zc.js","./assets/components-BXD123sj.js","./assets/confirm-C_mzp5wQ.js","./assets/icons-BMt8s7-O.js","./assets/jsQR-DMfxOdIb.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/portfolio-DWDzG8Kk.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/taxReport-Dcn6mmp2.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
