const CACHE_NAME = 'binance-wallet-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css', // Assuming you have a separate CSS file
  '/script.js', // Assuming you have a separate JS file
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
  'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js',
  'https://cdn.jsdelivr.net/npm/ethers@6.6.2/dist/ethers.min.js',
  'https://unpkg.com/chart.js@3.7.0/dist/chart.min.js',
  'https://unpkg.com/lightweight-charts@3.8.0/dist/lightweight-charts.js',
  'https://s3.tradingview.com/tv.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
