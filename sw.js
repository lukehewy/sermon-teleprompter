/* 讲道提词器离线缓存：装好后没网也能用；有网时永远取最新版（讲章库版） */
var CACHE = 'sermon-tp-v15';
var FILES = [
  './index.html',
  './sermon-teleprompter.html',
  './hs4.js',
  './shengling-work.js',
  './judges10.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(FILES); })
      .then(function(){ return self.skipWaiting(); })
  );
});
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; })
        .map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  /* 有网取最新并顺手更新缓存；断网用缓存 */
  e.respondWith(
    fetch(e.request).then(function(resp){
      var copy = resp.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      return resp;
    }).catch(function(){ return caches.match(e.request); })
  );
});
