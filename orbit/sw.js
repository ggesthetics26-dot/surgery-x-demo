/* ORBIT service worker: the app works offline after the first visit.
   Network first for pages, scripts and styles (so an update is never stuck behind the cache), cache first for art and audio. */
var CACHE = 'orbit-v5';
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') return;
  var u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.headers.get('range')) return;
  var heavy = /\/(art|audio)\//.test(u.pathname);
  if (heavy) {
    e.respondWith(caches.match(r).then(function (hit) { return hit || fetch(r).then(function (res) { if (res.ok && res.status === 200) { var c = res.clone(); caches.open(CACHE).then(function (ch) { ch.put(r, c); }); } return res; }); }));
    return;
  }
  e.respondWith(fetch(r).then(function (res) { if (res.ok) { var c = res.clone(); caches.open(CACHE).then(function (ch) { ch.put(r, c); }); } return res; }).catch(function () { return caches.match(r).then(function (hit) { return hit || caches.match('./index.html'); }); }));
});
