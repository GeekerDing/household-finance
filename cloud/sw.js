const CACHE = 'household-cloud-ea4431ce693c';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/CartesianChart-BXemaI8o.js","./assets/Coupons-DQhW-r6O.js","./assets/Debts-BArey6wb.js","./assets/Energy-zd-6UXTl.js","./assets/Life-B1w0mkdJ.js","./assets/Planning-Cgj5YlP1.js","./assets/RecordForm-D08QRSYP.js","./assets/Retirement-guYBgH0r.js","./assets/Spending--nyZBvAU.js","./assets/Spending-C4d6Ljwc.css","./assets/TaxFace-DmUqczia.js","./assets/TaxImportPage-DaARln9P.js","./assets/art-t6o5BooX.js","./assets/cache-BAnuDY53.css","./assets/cache-Dvj248K3.js","./assets/charts-BOotZExl.js","./assets/cloud-qtAjWQpV.js","./assets/cloud-z3htxOxS.css","./assets/common-Xb5suGjy.js","./assets/components-D5AN0x48.js","./assets/confirm-CdllDfFB.js","./assets/icons-BptL6cCF.js","./assets/jsQR-DMfxOdIb.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/portfolio-CxiQM8gk.js","./assets/rolldown-runtime-XKyaHtl9.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
