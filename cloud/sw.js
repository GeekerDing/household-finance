const CACHE = 'household-cloud-52a561d0241f';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/Assistant-QVx7T1JL.js","./assets/CartesianChart-DWTQsl6j.js","./assets/Coupons-BnyMj9Kf.js","./assets/Debts-BiLpIft-.js","./assets/Energy-F-W0Ru6p.js","./assets/InfoTip-Bkv6XNzD.js","./assets/InfoTip-Bt2Zez1W.css","./assets/Life-Cq-SIiN4.js","./assets/Planning-CXsCzRox.js","./assets/Retirement-CqjKcmc4.js","./assets/Spending-BKPa32i7.css","./assets/Spending-BjrzaMF8.js","./assets/TaxFace-Ck1GI8As.js","./assets/TaxImportPage-BXyFaBGg.js","./assets/art-zdiu46SI.js","./assets/charts-DPjwrkcF.js","./assets/cloud-BKDCdab1.js","./assets/cloud-BKIBxGH9.css","./assets/common-BovWTR1R.js","./assets/confirm-Dzoh9Xk0.js","./assets/dates-DD41S37f.js","./assets/energy-CP79bCoW.js","./assets/fx-CXRXcxbD.js","./assets/jsQR-DMfxOdIb.js","./assets/jsx-runtime-C3cWAN_r.js","./assets/model-3af_jQn9.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-DXrEVfit.js","./assets/portfolio-CZEfhPWs.js","./assets/retirement-C8eQVSEr.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/scenarios-PK9FxecH.js","./assets/spending-dxL1i138.js","./assets/wallet-G83k9KUZ.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
