const CACHE = 'household-cloud-bc3fa4bf64f1';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/Assistant-YZH-Wn32.js","./assets/CartesianChart-D93_dSg_.js","./assets/Coupons-D67WlBJC.js","./assets/Debts-CFSwOHnW.js","./assets/Energy-DA5uTzkO.js","./assets/InfoTip-BAnuDY53.css","./assets/InfoTip-C1yuoDKW.js","./assets/Life-DAfp4HQ_.js","./assets/Planning-Cs0R-2uS.js","./assets/Retirement-DkTPT4mJ.js","./assets/Spending-C4d6Ljwc.css","./assets/Spending-DEfGqtdm.js","./assets/TaxFace-B_NDaqpP.js","./assets/TaxImportPage-B5Dscqk6.js","./assets/art-pHrrAQlC.js","./assets/charts-CcnKAJRd.js","./assets/cloud-C008u1wM.css","./assets/cloud-M6fI4BJy.js","./assets/common-BRa0K3I_.js","./assets/confirm-DNc8otir.js","./assets/dates-DD41S37f.js","./assets/energy-CP79bCoW.js","./assets/fx-CXRXcxbD.js","./assets/jsQR-DMfxOdIb.js","./assets/jsx-runtime-C3cWAN_r.js","./assets/model-3af_jQn9.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-DXrEVfit.js","./assets/portfolio-CZEfhPWs.js","./assets/retirement-C8eQVSEr.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/scenarios-PK9FxecH.js","./assets/spending-dxL1i138.js","./assets/wallet-G83k9KUZ.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
