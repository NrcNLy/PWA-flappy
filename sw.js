// sw.js - Service Worker

const CACHE_NAME = 'personality-quiz-v1.3'; // Incremented version
const DYNAMIC_CACHE_NAME = 'personality-quiz-dynamic-v1.3'; // Incremented version

// Files to cache on install - these are the "app shell"
const urlsToCache = [
  '/', // This will cache the root, which should be your index.html
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'offline.html', // Crucial addition: Ensures offline page is precached
  // Add paths to your icons here, relative to the root.
  // Ensure all these files actually exist in your 'icons' folder.
  'icons/icon-72x72.png',
  'icons/icon-96x96.png',
  'icons/icon-128x128.png',
  'icons/icon-144x144.png',
  'icons/icon-152x152.png',
  'icons/icon-192x192.png',
  'icons/icon-384x384.png',
  'icons/icon-512x512.png',
  // Add any other static assets you want to cache immediately
  // e.g., 'images/welcome-banner.png' if you self-host the banner from intro slides
];

// Install event - cache the app shell
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[ServiceWorker] Failed to cache app shell. Ensure all paths in urlsToCache are correct and files exist.', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensure new service worker takes control immediately
});

// Fetch event - serve cached content when offline, or fetch from network
self.addEventListener('fetch', event => {
  // For navigation requests (HTML pages), try network first, then cache, then offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If successful, you could dynamically cache this HTML response if desired,
          // but be cautious as your app shell (index.html) is already pre-cached.
          // This might be more useful for other HTML pages if your app had them.
          // return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
          //   cache.put(event.request.url, response.clone());
          //   return response;
          // });
          return response;
        })
        .catch(() => {
          // Network failed, try to serve from cache
          return caches.match(event.request)
            .then(response => {
              return response || caches.match('/offline.html'); // Serve offline page if not in cache
            });
        })
    );
    return;
  }

  // For other requests (CSS, JS, images, fonts, API calls from script.js etc.), use a cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, then cache it dynamically
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response (e.g. not an error, not an opaque response for cross-origin requests unless intended)
            // Opaque responses (type: 'opaque') cannot have their contents read by the SW,
            // which is fine for just serving them, but their success/failure isn't detectable.
            if (!networkResponse || networkResponse.status !== 200 /*&& networkResponse.type !== 'opaque'*/) {
              // For non-200 responses, or if you want to be stricter with opaque ones, just return them without caching.
              // If you want to attempt to cache opaque (CDN) resources:
              // if (!networkResponse || (networkResponse.status !== 200 && networkResponse.type !== 'opaque')) {
              //    return networkResponse;
              // }
              return networkResponse;
            }

            // Clone the response. A response is a stream and can only be consumed once.
            // We need one for the browser and one for the cache.
            const responseToCache = networkResponse.clone();

            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(() => {
            // If both cache and network fail (e.g., for an image not in cache and offline)
            // You could return a fallback placeholder image if appropriate
            // For example, if the request destination is an image:
            // if (event.request.destination === 'image') {
            //    return caches.match('/icons/placeholder-image.png'); // You'd need to create and precache this
            // }
            // For other types, just let the browser handle the error, or return a more generic offline response/data
        });
      })
  );
});