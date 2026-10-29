const CACHE = 'household-cloud-d4eccdeba030';
const FILES = ["./index.html","./manifest.webmanifest","./assets/CartesianChart-C318VRyI.js","./assets/Coupons-CFpmQ-Ne.js","./assets/Debts-7PhZ0Shq.js","./assets/Energy-BRJnhz2T.js","./assets/InfoTip-BorL3Xoh.js","./assets/InfoTip-Bt2Zez1W.css","./assets/Life-D0Jcssjo.js","./assets/Planning-YySNixsU.js","./assets/Retirement-Cb-U_rai.js","./assets/Spending-BKPa32i7.css","./assets/Spending-DF6F7EUA.js","./assets/TaxFace-BGauzkd8.js","./assets/art-ACfd6HSw.js","./assets/charts-D6juVHef.js","./assets/cloud-CXYHvghk.js","./assets/cloud-CzTyJRg8.css","./assets/common-CAersfRh.js","./assets/components-RdHseOwy.js","./assets/confirm-DzyDet1T.js","./assets/energy-BhEDXJRx.js","./assets/jsQR-DMfxOdIb.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-Dsuxcbp9.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/spending-DDVhTkQD.js","./assets/wallet-D6JV4oCT.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
