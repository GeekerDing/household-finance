const CACHE = 'household-cloud-b70421d1de65';
const FILES = ["./index.html","./manifest.webmanifest","./about.html","./privacy.html","./assets/Assistant-zJ4OHFnj.js","./assets/CartesianChart-DJRiobOS.js","./assets/Coupons-C1KFY56m.js","./assets/Debts-DtE84uEJ.js","./assets/Energy-BP_fcoO7.js","./assets/InfoTip-B07RP-2u.js","./assets/InfoTip-BAnuDY53.css","./assets/Life-Dy0-V3YG.js","./assets/Planning-DEE_BOZ5.js","./assets/Retirement-BEE587KH.js","./assets/Spending-C4d6Ljwc.css","./assets/Spending-hpvsbY9U.js","./assets/TaxFace-t_Tl7UmQ.js","./assets/TaxImportPage-D_yuYGGW.js","./assets/art-CgczyiXW.js","./assets/cache-80m0-RDS.js","./assets/charts-CPPp9frh.js","./assets/cloud-BnG7CMdz.css","./assets/cloud-JCshDjZl.js","./assets/common-W4WW2Is3.js","./assets/confirm-CrlRkxXD.js","./assets/energy-B8c60uBT.js","./assets/fx-4tWvA2Av.js","./assets/jsQR-DMfxOdIb.js","./assets/jsx-runtime-C3cWAN_r.js","./assets/model-CnEiya6x.js","./assets/pdf-DZw16B5N.js","./assets/pdf.worker.min-CjEcRF4W.mjs","./assets/planning-uZ6yq_xT.js","./assets/portfolio-Fb4M-7sF.js","./assets/retirement-BYG5EH-9.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/scenarios-Cd_Uj-mC.js","./assets/spending-rhNMkKG9.js","./assets/wallet-DO8yt9RE.js","./icons/apple-touch-icon.png","./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
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
