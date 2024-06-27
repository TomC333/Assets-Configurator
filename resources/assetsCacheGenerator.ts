// make sure to install npm install ts - node typescript--save - dev

// npx ts-node pathGenerator.ts
import * as fs from 'fs';
import * as path from 'path';

function getAllFiles(baseDir: string, currentDir: string): string[] {
    let fileList: string[] = [];

    // Read the contents of the directory
    const files = fs.readdirSync(currentDir);

    // Iterate through all files/directories found
    files.forEach((file) => {
        const filePath = path.join(currentDir, file);

        // Check if it's a directory
        if (fs.statSync(filePath).isDirectory()) {
            fileList = fileList.concat(getAllFiles(baseDir, filePath));
        } else {
            const relativePath = path.relative(baseDir, filePath);
            const normalizedPath = relativePath.replace(/\\/g, '/');
            fileList.push(normalizedPath);
        }
    });

    return fileList;
}

// Function to generate TypeScript code for fetching assets and storing them in a specified cache
function generateAssetFetchAndCacheCode(files: string[], outputPath: string) {
    // Generate TypeScript code
    let tsCode = `export async function fetchAndCacheAssets(cacheName: string) {\n`;

    tsCode += `    const assetCacheName = cacheName;\n\n`;

    tsCode += `    async function addToCache(url: string) {\n`;
    tsCode += `        try {\n`;
    tsCode += `            const response = await fetch(url);\n`;
    tsCode += `            if (!response.ok) {\n`;
    tsCode += `                throw new Error('Network response was not ok');\n`;
    tsCode += `            }\n`;
    tsCode += `            const blob = await response.blob();\n`;``
    tsCode += `            const cache = await caches.open(assetCacheName);\n`;
    tsCode += `            await cache.put(url, new Response(blob));\n`;
    tsCode += `        } catch (error) {\n`;
    tsCode += `        }\n`;
    tsCode += `    }\n\n`;

    files.forEach((file) => {
        // Call addToCache function for each file
        tsCode += `    await addToCache('${file}');\n`;
    });

    tsCode += `}\n`;

    // Write TypeScript code to file
    fs.writeFileSync(outputPath, tsCode);
}

const baseDirectory = 'D:/Repos/Web/src/'; // Replace with your base directory path
const startingDirectory = 'D:/Repos/Web/src/Assets'; // Replace with your starting directory path
const files = getAllFiles(baseDirectory, startingDirectory);

const outputFilePath = 'D:/Repos/Web/Generators/fetchAndCacheAssets.ts'; // Replace with your desired output file path
generateAssetFetchAndCacheCode(files, outputFilePath);
