const CACHE = 'household-static-v2-1';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.addAll(['./manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png']),
      ),
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('household-static-') && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener('message', (event) => {
  if (event.data === 'ACTIVATE_UPDATE') self.skipWaiting();
});
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
      fetch(event.request)
        .then((r) => (r.ok ? r : offline()))
        .catch(() => offline()),
    );
    return;
  }
  if (!(
    /\/assets\/[a-zA-Z0-9_.-]+\.(?:js|mjs|css)$/.test(u.pathname) ||
    /\/icons\/icon-(192|512)\.png$/.test(u.pathname) ||
    u.pathname.endsWith('/manifest.webmanifest')
  ))
    return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const saved = await cache.match(event.request);
      if (saved) return saved;
      const r = await fetch(event.request);
      if (r.ok) await cache.put(event.request, r.clone());
      return r;
    }),
  );
});
function offline() {
  return new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>家账服务离线</title><body style="font:17px/1.8 system-ui;margin:40px;background:#f6f7f2;color:#245b44"><h1>家账服务暂时离线</h1><p>请检查 Mac 是否开机并运行家账服务，以及手机的 Tailscale 连接。</p><p>离线期间暂停查看最新资料和修改；财务数据不会保存在应用缓存中。</p><a href="./">重新连接</a>',
    { headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'no-store' } },
  );
}
