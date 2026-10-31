const CACHE = 'household-cloud-8072ea5e5182';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/Assistant-CtBVgnwn.js","./assets/CartesianChart-BaXBFOkp.js","./assets/Coupons-Cx8rQV2O.js","./assets/Debts-D1ePl133.js","./assets/Energy-CVvQ-hO3.js","./assets/InfoTip-Bt2Zez1W.css","./assets/InfoTip-Bvh_czXV.js","./assets/Life-DtkNxS3X.js","./assets/Planning-DuWenqGE.js","./assets/Retirement-D5vvVlt3.js","./assets/Spending-BKPa32i7.css","./assets/Spending-CggfiRdh.js","./assets/TaxFace-DnGTKSYb.js","./assets/TaxImportPage-Bsd7Lcpi.js","./assets/art-DquhzhrU.js","./assets/charts-D1xU156Q.js","./assets/cloud-5dJWX6EC.js","./assets/cloud-DQ26G1hh.css","./assets/common-PhkFX-ae.js","./assets/confirm-CwbfsJlk.js","./assets/dates-DD41S37f.js","./assets/energy-CP79bCoW.js","./assets/fx-CXRXcxbD.js","./assets/jsQR-DMfxOdIb.js","./assets/jsx-runtime-C3cWAN_r.js","./assets/model-3af_jQn9.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-Y6RIx-4t.js","./assets/portfolio-CZEfhPWs.js","./assets/retirement-CsQGyp5f.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/scenarios-F_fgag04.js","./assets/spending-dxL1i138.js","./assets/wallet-G83k9KUZ.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
