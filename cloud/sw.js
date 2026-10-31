const CACHE = 'household-cloud-6ed097d1d711';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/Assistant-DvtBaivX.js","./assets/CartesianChart-BaXBFOkp.js","./assets/Coupons-BwyC6e0g.js","./assets/Debts-BreIn7QC.js","./assets/Energy-BmyfGvPz.js","./assets/InfoTip-Bt2Zez1W.css","./assets/InfoTip-Bvh_czXV.js","./assets/Life-C4oamS7f.js","./assets/Planning-DW5M9sTi.js","./assets/Retirement-wh4s1Cof.js","./assets/Spending-BKPa32i7.css","./assets/Spending-DWuziUHc.js","./assets/TaxFace-DJUIL3Kt.js","./assets/TaxImportPage-C4Mhv1d5.js","./assets/art-DquhzhrU.js","./assets/cache-DZLa3BDb.js","./assets/charts-D1xU156Q.js","./assets/cloud-CTIg-6pD.css","./assets/cloud-CeZRE5tr.js","./assets/common-PhkFX-ae.js","./assets/confirm-CwbfsJlk.js","./assets/energy-BQUD60UL.js","./assets/jsQR-DMfxOdIb.js","./assets/jsx-runtime-C3cWAN_r.js","./assets/model-B2fzN8eA.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-BQVXYlR1.js","./assets/retirement-n97RNjom.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/spending-5sEY06wF.js","./assets/wallet-RF2DenRN.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
