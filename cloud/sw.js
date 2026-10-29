const CACHE = 'household-cloud-136bdfc47f73';
const FILES = ["./index.html","./manifest.webmanifest","./assets/CartesianChart-DhdkDP5p.js","./assets/Coupons-BzZMe9rF.js","./assets/Debts-CidcZGXc.js","./assets/Energy-BjtLqldg.js","./assets/InfoTip-Bt2Zez1W.css","./assets/InfoTip-ox8WPjfU.js","./assets/Life-CsoXUB_r.js","./assets/Planning-Bnm4fkCU.js","./assets/Retirement-C-fK9FY6.js","./assets/Spending-BKPa32i7.css","./assets/Spending-CrZqcoXV.js","./assets/TaxFace-D6XTZH5w.js","./assets/art-ACfd6HSw.js","./assets/charts-BYmF7EY9.js","./assets/cloud-Bu98Rysp.js","./assets/cloud-hbnhcElN.css","./assets/common-R3XXBJYo.js","./assets/components-qG5d9Q2b.js","./assets/confirm-7-C6qrP0.js","./assets/energy-BwRgBlQw.js","./assets/jsQR-DMfxOdIb.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-DigD6VYH.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/spending-CMrBNlSz.js","./assets/wallet-BttCs8lT.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
