# Asset Configurator 🎨

Asset Configurator is an npm library designed to empower designers by allowing them to change website assets manually without altering the underlying codebase. It leverages service workers and caching techniques to achieve this dynamic asset management seamlessly.

## Before npm Library Setup

### 2.1 Before using the library, run the `assetCacheGenerator`:

```typescript
// Replace variables in this TypeScript script:
const baseDirectory = '/path/to/your/base/directory';
const startingDirectory = '/path/to/your/asset/directory';
const outputFilePath = '/path/to/output/file';

// code snippet should be placed here 
```

After running `assetCacheGenerator`, you will receive a function that needs to be executed before your application starts. This function expects a cache name argument (`"next-level-default-cache"` or using `Globals.DEFAULT_CACHE_NAME` from npm package).

### 2.2 If your hosted website lacks a valid SSL certificate:

Service workers require HTTPS to function securely. To work around this, enable Chrome to treat insecure origins as secure:

- Navigate to `chrome://flags/`
- Find "Insecure origins treated as secure"
- Enable it and add your HTTP hostname

### 2.3 Add an API endpoint to your backend:

To create unlimited service workers, add the following C# .NET code example (or equivalent in another language):

```csharp
// Replace variables in this C# example:
var endpointUrl = "https://your-api-endpoint.example.com";
var serviceName = "your-service-worker-name";

// Insert your GitHub code snippet here
Response.Headers.Add("Service-Worker-Allowed", "/");
```

### 2.4 Install the package:

```bash
npm i assets-configurator
```

### 2.5 Add HTML to your web page:

```html
<!-- Replace with your HTML snippet -->
<script src="path/to/your/compiled/javascript.js"></script>
```

### 2.6 Link TypeScript (or compiled JavaScript) code to HTML:

```html
<!-- Replace with your linking code -->
<script src="path/to/your/compiled/javascript.js"></script>
```

## ⚠️ Warning

This package is intended for development purposes only. Using this package in production may introduce security vulnerabilities. It is recommended to remove this library from your project and revert any changes made to `chrome://flags` after publishing.

## Usage Instructions

// Add your specific instructions on how to use the library here
