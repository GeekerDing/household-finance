const CACHE = 'household-cloud-5e5848eade39';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/Assistant-0P19R0Di.js","./assets/CartesianChart-BaXBFOkp.js","./assets/Coupons-BhJPB4XZ.js","./assets/Debts-C-ltN98s.js","./assets/Energy-DXNBcxVr.js","./assets/InfoTip-Bt2Zez1W.css","./assets/InfoTip-Bvh_czXV.js","./assets/Life-CV3nrDgr.js","./assets/Planning-CGb-zDOe.js","./assets/Retirement-EKM8zAhJ.js","./assets/Spending-BKPa32i7.css","./assets/Spending-CP3GdJcx.js","./assets/TaxFace-DpSVqnNO.js","./assets/TaxImportPage-9uxj7Sa7.js","./assets/art-DquhzhrU.js","./assets/cache-DZLa3BDb.js","./assets/charts-D1xU156Q.js","./assets/cloud-CTIg-6pD.css","./assets/cloud-De9nN6Jm.js","./assets/common-PhkFX-ae.js","./assets/confirm-CwbfsJlk.js","./assets/energy-BQUD60UL.js","./assets/jsQR-DMfxOdIb.js","./assets/jsx-runtime-C3cWAN_r.js","./assets/model-B2fzN8eA.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-BQVXYlR1.js","./assets/retirement-n97RNjom.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/spending-5sEY06wF.js","./assets/wallet-RF2DenRN.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
