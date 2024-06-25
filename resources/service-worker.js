const DEFAULT_CACHE_NAME = 'next-level-default-cache';
const OVERRIDE_CACHE_NAME = 'next-level-default-cache'; // that part should be changed by API endpoint

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(OVERRIDE_CACHE_NAME).then(overrideCache => {
      return overrideCache.match(event.request).then(overrideResponse => {
        // serve asset from overriden cache if it's possible
        if (overrideResponse) {
          return overrideResponse; 
        }

        // if not serve assets from default cache 
        return caches.open(DEFAULT_CACHE_NAME).then(defaultCache => {
          return defaultCache.match(event.request).then(defaultResponse => {
            if (defaultResponse) {
              return defaultResponse; 
            }

            // if not found inside default cache or overriden cache try to get it from network
            return fetch(event.request).then(networkResponse => {
              const responseClone = networkResponse.clone();
            
              // cache only image, audio, video assets
              caches.open(CACHE_NAME).then(cache => {
                if (event.request.url.match(/\.(png|jpg|jpeg|gif|bmp|webp)$/i) || event.request.url.match(/\.(mp4|webm|ogg)$/i) || event.request.url.match(/\.(mp3|wav|ogg)$/i)) {
                  cache.put(event.request, responseClone); 
                }
              });
              return networkResponse;
            }).catch(error => {
              console.error("Fetch error:", error);
            });
          });
        });
      });
    })
  );
});

