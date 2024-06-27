const DEFAULT_CACHE_NAME = 'next-level-default-cache';
const OVERRIDE_CACHE_NAME = 'next-level-default-cache'; // that part should be changed by API endpoint

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(OVERRIDE_CACHE_NAME).then(override_cache => {
      return override_cache.match(event.request).then(override_response => {
        // serve asset from overriden cache if it's possible
        if (override_response) {
          return override_response; 
        }

        // if not serve assets from default cache 
        return caches.open(DEFAULT_CACHE_NAME).then(default_cache => {
          return default_cache.match(event.request).then(default_response => {
            if (default_response) {
              return default_response; 
            }

            // if not found inside default cache or overriden cache try to get it from network
            return fetch(event.request).then(network_response => {
              const response_clone = network_response.clone();
            
              // cache only image, audio, video, json assets
              caches.open(CACHE_NAME).then(cache => {
                if (event.request.url.match(/\.(png|jpg|jpeg|gif|bmp|webp)$/i) || event.request.url.match(/\.(mp4|webm|ogg)$/i) || event.request.url.match(/\.(mp3|wav|ogg)$/i) || event.request.url.endsWith('.json')) {
                  cache.put(event.request, response_clone); 
                }
              });
              return network_response;
            }).catch(error => {
              console.error("Fetch error:", error);
            });
          });
        });
      });
    })
  );
});

