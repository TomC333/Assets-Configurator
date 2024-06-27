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
