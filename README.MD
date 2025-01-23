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

Please create seperate route for this page...

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assets Configurator</title>

    <style>

        * {
            margin: 0;
            padding: 0;
            user-select: none;
            box-sizing: border-box;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-select: none;
            -webkit-user-select: none;
            -webkit-overflow-scrolling: touch;
            font-family: sans-serif;
            font-weight: bold;
            color: red;
        }

        body {
            background-color: black;
        }

        @media (pointer: fine) {
            #loading-popup .close-button:hover {
                filter: brightness(1.1);
                cursor: pointer;
            }

            .assets-profile:hover {
                cursor: pointer;
                border-color: #ffffff71;
            }

            .basic-button:hover{
                filter: brightness(1.1);
                cursor: pointer;
            }
        }

        #loading-popup {
            width: 100%;
            height: 100%;
            background-color: rgb(0 0 0 / 90%);
            position: absolute;
            z-index: 999999;
        }

            #loading-popup .loading-animation-container {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 95px;
                aspect-ratio: 1;
                display: grid;
            }

                #loading-popup .loading-animation-container:before,
                #loading-popup .loading-animation-container:after {
                    content: "";
                    grid-area: 1/1;
                    width: 45px;
                    aspect-ratio: 1;
                    box-shadow: 0 0 0 3px #fff inset;
                    filter: drop-shadow(50px 50px 0 #fff);
                    animation: loader-animation 2s infinite alternate;
                }

                #loading-popup .loading-animation-container:after {
                    margin: 0 0 0 auto;
                    filter: drop-shadow(-50px 50px 0 #fff);
                    animation-delay: -1s;
                }

        @keyframes loader-animation {
            0%,10% {
                border-radius: 0
            }

            30%,40% {
                border-radius: 50% 0
            }

            60%,70% {
                border-radius: 50%
            }

            90%,100% {
                border-radius: 0 50%
            }
        }

        #loading-popup .loading-message-container {
            max-width: 650px;
            width: 100%;
            height: 100%;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-evenly;
        }

        #loading-popup .close-button {
            padding: 15px;
            border-radius: 30px;
            background: rgb(240, 160, 0);
            width: fit-content;
            transition: 0.5s ease all;
        }

        #loading-popup .text-content {
            text-align: center;
            width: 70%;
            margin: 0 auto;
        }

        #loading-popup.hidden, .loading-animation-container.hidden, .loading-message-container.hidden, .close-button.hidden,  .asset-container.hidden {
            display: none !important;
        }

        .assets-configurator-container {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .assets-configurator-header {
            width: calc(100% - 20px);
            height: calc(20% - 20px);
            margin: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
            border-radius: 4px;
            background: #cd933a;
        }

        .profiles-section-container, .create-new-profile-container {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .assets-container {
            position: absolute;
            width: calc(100% - 20px);
            height: calc(80% - 20px);
            overflow-y: scroll;
            margin: 10px;
            border-radius: 4px;
            background: #cd933a;
        }

        .asset-container {
            width: calc(100% - 8px);
            margin: 10px 0 10px 8px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
            border-radius: 10px;
            background: #715e17;
        }

        .asset-info {
            width: 10%;
        }

        .asset-info textarea{
            width: 100%;
        }

        .asset-settings {
            width: 50%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
        }

        .asset {
            width: 30%;
            height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #004a57
        }

        .asset img, .asset audio, .asset pre {
            max-height: 90%;
        }

        .assets-container::-webkit-scrollbar {
            width: 8px;
        }

        .assets-containerr::-webkit-scrollbar-track {
            background: #edff00;
            border-radius: 12px;
        }

        .assets-container::-webkit-scrollbar-thumb {
            background: #edff00;
            border-radius: 12px;
        }

        .settings-and-filters-container, .profiles-select-container, .file-input-elements-container{
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .file-input-elements-container{
            background: #004a57;
            padding: 10px;
            border-radius: 10px;
        }

        .file-input-elements-container input{
            width: 182px;
        }

        .settings-and-filters-container{
            flex-direction: row;
        }

        .basic-button{
            color: white;
            padding: 5px;
            background: cadetblue;
            border-radius: 10px;
            transition: 0.5s ease all;
            margin: 5px;
        }

        .assets-filter-selector{
            max-width: 200px;
            margin: 5px;
        }

    </style>
</head>
<body>

    <div id="loading-popup">
        <div class="loading-animation-container"></div>
        <div class="loading-message-container">
            <div class="text-content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, quo debitis accusamus et ullam necessitatibus natus maiores excepturi laudantium eum officiis quaerat? Dicta praesentium blanditiis sequi accusantium mollitia voluptatem amet.</div>
            <div class="close-button">CLOSE</div>
        </div>
    </div>


    <div class="assets-configurator-container">
        <div class="assets-configurator-header">
            <div class="profiles-select-container">
                <select id="profile-selector" class="profile-selector"></select>
                <div class="delete-profile-button basic-button">DELETE</div>
            </div>

            <div class="settings-and-filters-container">
                <select id="assets-filter-selector" class="assets-filter-selector"></select>                
                <div class="create-new-profile-container">
                    <input type="text" id="new-profile-name-input" name="textInput" placeholder="Type new profile name...">
                    <div class="create-new-profile-button basic-button">CREATE</div>
                </div>

                <div class="download-button basic-button">DOWNLOAD</div>
            </div>
        </div>

        <div class="assets-configurator-body assets-container"></div>
    </div>
</body>
</html>  
```

### 📌 Link your TypeScript (or compiled JavaScript) code to HTML:

```typescript
import { AssetsManager } from 'assets-configurator';


const APIEndpoint = 'http://some_host/GetWorkerJs/'
new AssetsManager(APIEndpoint);
```

## 📌 How to use?
Using the configurator is straightforward. First, open the configurator page and wait for the default profile to load. Once the default profile has loaded, navigate to your application and ensure that all assets are fully loaded. If some assets use lazy loading, make sure to load those as well. After all assets are fully loaded, restart the configurator page. At this point, all the assets should be visible to you. You can then add new profiles and configure the assets as needed.

## ⚠️ Warning

This package is intended for development purposes only. Using this package in production may introduce security vulnerabilities. It is recommended to remove this library from your project and revert any changes made to `chrome://flags` after publishing.
