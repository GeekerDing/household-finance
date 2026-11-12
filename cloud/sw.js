const CACHE = 'household-cloud-042f067bb4eb';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/Assistant-CO8QCtd0.js","./assets/CartesianChart-DJRiobOS.js","./assets/Coupons-BFqWpqu7.js","./assets/Debts-BQDTQ57M.js","./assets/Energy-C5W2XScG.js","./assets/InfoTip-B07RP-2u.js","./assets/InfoTip-BAnuDY53.css","./assets/Life-FX50rvwO.js","./assets/Planning-BPl0RT79.js","./assets/Retirement-DEnHUFNh.js","./assets/Spending-C4d6Ljwc.css","./assets/Spending-ZgXoV-uU.js","./assets/TaxFace-C0ctBa2q.js","./assets/TaxImportPage-ZrLHxLtS.js","./assets/art-CgczyiXW.js","./assets/charts-CeaBKmdL.js","./assets/cloud-B9KtyFvG.css","./assets/cloud-DZdqj1GJ.js","./assets/common-W4WW2Is3.js","./assets/confirm-CrlRkxXD.js","./assets/dates-DD41S37f.js","./assets/energy-CP79bCoW.js","./assets/fx-CXRXcxbD.js","./assets/jsQR-DMfxOdIb.js","./assets/jsx-runtime-C3cWAN_r.js","./assets/model-3af_jQn9.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-BDz16n3A.js","./assets/portfolio-AVPEHp80.js","./assets/retirement-DDvCGgiX.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/scenarios-D_AFNf8k.js","./assets/spending-dxL1i138.js","./assets/wallet-G83k9KUZ.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
