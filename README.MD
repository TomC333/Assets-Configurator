# Asset Configurator 🎨

Asset Configurator is an npm library designed to empower designers by allowing them to manually change website assets without altering the underlying codebase. It leverages service workers and caching techniques to achieve dynamic asset management seamlessly.

## Before npm Library Setup

### Before using the library, run the following code:

```typescript
[https://github.com/TomC333/Assets-Configurator/blob/main/resources/assets-cache-generator.ts]
```

Don't forget to replace the variables with the correct ones:
```typescript
const baseDirectory = '/path/to/your/base/directory';
const startingDirectory = '/path/to/your/asset/directory';
const outputFilePath = '/path/to/output/file';
```

After running the code, you will receive a function that needs to be executed before your application starts. This function expects a cache name argument (`"next-level-default-cache"` or use `Globals.DEFAULT_CACHE_NAME` from the npm package).

### If hosting on HTTP or your hosted website lacks a valid SSL certificate:

Service workers require HTTPS to function securely. To work around this, enable Chrome to treat insecure origins as secure:

- Navigate to `chrome://flags/`
- Find "Insecure origins treated as secure"
- Enable it and add your HTTP hostname

### Add an API endpoint to your backend:

To create unlimited service workers, add the following C# .NET code example (or equivalent in another language) to your API:

```csharp
[https://github.com/TomC333/Assets-Configurator/blob/main/resources/api-endpoint.cs]
```

Don't forget to add this header to the response:

```csharp
Response.Headers.Add("Service-Worker-Allowed", "/");
```

### Install the package:

```bash
npm i assets-configurator
```

### Add this HTML to your web page:

```html
[https://github.com/TomC333/Assets-Configurator/blob/main/resources/assets-configurator.html]
```

### Link your TypeScript (or compiled JavaScript) code to HTML:

```typescript
[https://github.com/TomC333/Assets-Configurator/blob/main/resources/assets-configurator.js]
```

## ⚠️ Warning

This package is intended for development purposes only. Using this package in production may introduce security vulnerabilities. It is recommended to remove this library from your project and revert any changes made to `chrome://flags` after publishing.