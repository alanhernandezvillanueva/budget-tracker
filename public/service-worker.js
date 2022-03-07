const APP_PREFIX = 'budget-tracker';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION
const FILES_TO_CACHE = [
  "/",
  "manifest.webmanifest",
  "index.html",
  "assets/css/styles.css",
  "assets/js/index.js",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  "assets/js/db.js",
  "assets/img/icons/icon-192x192.png",
  "assets/img/icons/icon-512x512.png",
];

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
     caches.match(e.request).then(function (request) {
         if (request) {
             console.log('responding with cache : ' + e.request.url)
             return request
         } else {
             console.log('file is not cached, fetching : ' + e.request.url)
             return fetch(e.request)
         }
          // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
     }) 
  )
});

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
          console.log('installing cache : ' + CACHE_NAME)
          return cache.addAll(FILES_TO_CACHE)
      })
  )
});

// Delete outdated caches

self.addEventListener('activate', function (e) {
  e.waitUntil(
      caches.keys().then(function (keyList) {
         // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create keeplist
          let cacheKeeplist = keyList.filter(function (key) {
              return key.indexOf(APP_PREFIX);
          });
           // add current cache name to keeplist
          cacheKeeplist.push(CACHE_NAME);

          return Promise.all(keyList.map(function (key, i) {
              if (cacheKeeplist.indexOf(key) === -1) {
                  console.log('deleteing cache : ' + keyList[i] );
                  return caches.delete(keyList[i]);
              }
          })
          );

      })
  );
});

