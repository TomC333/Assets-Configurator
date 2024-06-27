# Asset Configurator 🎨

Asset Configurator is an npm library designed to empower designers by allowing them to manually change website assets without altering the underlying codebase. It leverages service workers and caching techniques to achieve dynamic asset management seamlessly.

## Before npm Library Setup

### 📌 Before using the library, run the following code:

```typescript
// make sure to install npm install ts - node typescript--save - dev

// npx ts-node pathGenerator.ts
import * as fs from 'fs';
import * as path from 'path';

function get_all_files(base_dir: string, current_dir: string): string[] {
    let file_list: string[] = [];

    // Read the contents of the directory
    const files = fs.readdirSync(current_dir);

    // Iterate through all files/directories found
    files.forEach((file) => {
        const file_path = path.join(current_dir, file);

        // Check if it's a directory
        if (fs.statSync(file_path).isDirectory()) {
            file_list = file_list.concat(get_all_files(base_dir, file_path));
        } else {
            const relative_path = path.relative(base_dir, file_path);
            const normalized_path = relative_path.replace(/\\/g, '/');
            file_list.push(normalized_path);
        }
    });

    return file_list;
}

// Function to generate TypeScript code for fetching assets and storing them in a specified cache
function generate_asset_fetch_and_cache_code(files: string[], output_path: string) {
    // Generate TypeScript code
    let ts_code = `export async function fetchAndCacheAssets(cacheName: string) {\n`;

    ts_code += `    const assetCacheName = cacheName;\n\n`;

    ts_code += `    async function addToCache(url: string) {\n`;
    ts_code += `        try {\n`;
    ts_code += `            const response = await fetch(url);\n`;
    ts_code += `            if (!response.ok) {\n`;
    ts_code += `                throw new Error('Network response was not ok');\n`;
    ts_code += `            }\n`;
    ts_code += `            const blob = await response.blob();\n`;``
    ts_code += `            const cache = await caches.open(assetCacheName);\n`;
    ts_code += `            await cache.put(url, new Response(blob));\n`;
    ts_code += `        } catch (error) {\n`;
    ts_code += `        }\n`;
    ts_code += `    }\n\n`;

    files.forEach((file) => {
        // Call addToCache function for each file
        ts_code += `    await addToCache('${file}');\n`;
    });

    ts_code += `}\n`;

    // Write TypeScript code to file
    fs.writeFileSync(output_path, ts_code);
}

const base_directory = 'D:/Repos/Web/src/'; // Replace with your base directory path
const starting_directory = 'D:/Repos/Web/src/Assets'; // Replace with your starting directory path
const files = get_all_files(base_directory, starting_directory);

const output_file_path = 'D:/Repos/Web/Generators/fetchAndCacheAssets.ts'; // Replace with your desired output file path
generate_asset_fetch_and_cache_code(files, output_file_path);
```

Don't forget to replace the variables with the correct ones:
```typescript
const baseDirectory = '/path/to/your/base/directory';
const startingDirectory = '/path/to/your/asset/directory';
const outputFilePath = '/path/to/output/file';
```

After running the code, you will receive a function that needs to be executed before your application starts. This function expects a cache name argument (`"next-level-default-cache"` or use `Globals.DEFAULT_CACHE_NAME` from the npm package).

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