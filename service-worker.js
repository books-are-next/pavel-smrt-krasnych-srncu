/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-af699b1';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./resources.html","./smrt_krasnych_srncu_001.html","./smrt_krasnych_srncu_002.html","./smrt_krasnych_srncu_003.html","./smrt_krasnych_srncu_005.html","./smrt_krasnych_srncu_006.html","./smrt_krasnych_srncu_007.html","./smrt_krasnych_srncu_008.html","./smrt_krasnych_srncu_009.html","./smrt_krasnych_srncu_010.html","./smrt_krasnych_srncu_011.html","./smrt_krasnych_srncu_012.html","./smrt_krasnych_srncu_013.html","./resources/image001_fmt.png","./resources/image002_fmt.png","./resources/index.xml","./resources/obalka_smrt_krasnych_sr_fmt.png","./resources/upoutavka_eknihy_fmt.png","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
