# Asset Configurator 🎨

Asset Configurator is an npm library designed to empower designers by allowing them to manually change website assets without altering the underlying codebase. It leverages service workers and caching techniques to achieve dynamic asset management seamlessly.

## Before npm Library Setup

### 📌 If hosting on HTTP or your hosted website lacks a valid SSL certificate:

Service workers require HTTPS to function securely. To work around this, enable Chrome to treat insecure origins as secure:

- Navigate to `chrome://flags/`
- Find "Insecure origins treated as secure"
- Enable it and add your HTTP hostname

### 📌 Add an API endpoint to your backend:

To create unlimited service workers, add the following C# .NET code example (or equivalent in another language) to your API:

```csharp
[Route("GetWorkerJs/{cacheName}")]
public IActionResult GetWorkerJs(string cacheName)
{
    Response.Headers.Add("Service-Worker-Allowed", "/");

    string scriptContent = @"
        const DEFAULT_CACHE_NAME = 'next-level-default-cache';
        const OVERRIDE_CACHE_NAME = '" + cacheName + @"'; // that part should be changed by API endpoint

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
                    caches.open(DEFAULT_CACHE_NAME).then(cache => {
                        if (event.request.url.match(/\.(png|jpg|jpeg|gif|bmp|webp)$/i) || event.request.url.match(/\.(mp4|webm|ogg)$/i) || event.request.url.match(/\.(mp3|wav|ogg)$/i)) {
                        cache.put(event.request, responseClone); 
                        }
                    });
                    return networkResponse;
                    }).catch(error => {
                    console.error(""Fetch error:"", error);
                    });
                });
                });
            });
            })
        );
        });
    ";

    return Content(scriptContent, "application/javascript");
}
```

Don't forget to add this header to the response:

```csharp
Response.Headers.Add("Service-Worker-Allowed", "/");
```

### 📌 Install the package:

```bash
npm i assets-configurator
```

### 📌 Add this HTML to your web page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assets Configurator</title>
</head>
<body>
    
    <div class="assets-configurator-container">
        <div class="assets-container">
            
        </div>
    </div>

</body>
</html>
```

### 📌 Link your TypeScript (or compiled JavaScript) code to HTML:

```typescript
// TO:DO
```

## ⚠️ Warning

This package is intended for development purposes only. Using this package in production may introduce security vulnerabilities. It is recommended to remove this library from your project and revert any changes made to `chrome://flags` after publishing.