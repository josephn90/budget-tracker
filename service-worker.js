const FILES_TO_CACHE = [
    "./public/index.html",
    "./public/css/styles.css",
    "./public/js/index.js"
];

const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('Installing cache: ' + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    )
})

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheList.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheList.indexOf(key) === -1) {
                        console.log('Deleting cache: ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (e) {
    console.log('Fetch request: ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('Responding with cache: ' + e.request.url);
                return request;
            } else {
                console.log('File is not cached, fetching: ' + e.request.url);
                return fetch(e.request);
            }
        })
    )
})