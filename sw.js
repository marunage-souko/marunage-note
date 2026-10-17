/* 丸投げ倉庫の通知を受け取る。
 * 届く中身は、家のパソコンの丸投げ倉庫が暗号にして送ったもの。ここでは表示するだけで、どこにも送らない */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || '丸投げ倉庫', {
    body: d.body || 'お知らせがあります',
    tag: d.tag || undefined,
    icon: 'icon-192.png',
    data: { tab: d.tab || '' },
  }));
});

// 通知を押したら、出品ノートを開く（開いていれば前に出す）
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const 開いている = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (開いている.length) return 開いている[0].focus();
    return self.clients.openWindow('./');
  })());
});
