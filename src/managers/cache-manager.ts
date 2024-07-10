import { CacheTypes } from "../utils/enums";

import JSZip  from 'jszip';
import { Globals } from "../utils/globals";

export class CacheManager{

    constructor() {

    }

    /**
     * Retrieves an array of all cache names available in the Cache API.
     * If the Cache API is not supported, logs an error message and resolves with an empty array.
     * @returns A Promise that resolves with an array of cache names available in the Cache API,
     *          or resolves with an empty array if the Cache API is not supported.
     */
    async get_all_cache_names(): Promise<string[]> {
        if (!('caches' in window)) {
            console.error('Cache API is not supported');
            return [];
        }

        try {
            const cacheNames = await caches.keys();
            return cacheNames;
        } catch (error) {
            console.error("Error while trying to get cache names -> ", error);
            return [];
        }
    }

    /**
     * Retrieves unique key-value pairs from specified caches.
     * Keys existing in both caches will have their value taken from the second cache.
     * @param default_cache The name of the default cache.
     * @param override_cache The name of the override cache.
     * @returns A promise that resolves with an array of unique key-value pairs from both caches.     
     *          If either cache does not exist or cannot be accessed, resolves with an empty array.
     */
    async get_unique_cache_key_value_pairs(default_cache: string, override_cache: string): Promise<any[]> {
        if (!('caches' in window)) {
            console.error('Cache API is not supported');
            return [];
        }

        try {
            const cache1 = await caches.open(default_cache);
            const cache2 = await caches.open(override_cache);

            const cache1_keys = await cache1.keys();
            const cache2_keys = await cache2.keys();

            const unique_keys = new Set<string>();

            cache1_keys.forEach(request => unique_keys.add(request.url));
            cache2_keys.forEach(request => unique_keys.add(request.url));

            const unique_key_array = Array.from(unique_keys);

            const key_value_pairs = await Promise.all(unique_key_array.map(async (key) => {
                const response_from_cache2 = await cache2.match(key);
                const response = response_from_cache2 ?? await cache1.match(key);
                
                if (response) {
                    // Check the content type of the response
                    const content_type = response.headers.get('Content-Type');
                    
                    if (content_type) {
                        let type: CacheTypes;
                        let value; 

                        if (content_type.match(/^image\//)) {
                            const blob = await response.blob();

                            value = URL.createObjectURL(blob);
                            type = CacheTypes.IMAGE;

                        } else if (content_type.match(/^audio\//)) {
                            const blob = await response.blob();
                            
                            value = URL.createObjectURL(blob);
                            type = CacheTypes.AUDIO;

                        } else if (content_type.match(/^video\//)) {
                            const blob = await response.blob();

                            value = URL.createObjectURL(blob);
                            type = CacheTypes.VIDEO;

                        } else if (content_type.match(/^application\/json/)) {
                            value = await response.json();
                            type = CacheTypes.JSON;

                        }else{
                            return null;
                        }

                        return { type: type, key: key, value: value };
                    }
                }
                return null;
            }));

            const filtered_key_value_pairs = key_value_pairs.filter(pair => pair !== null);

            return filtered_key_value_pairs;
        } catch (error) {
            console.error('Error retrieving key-value pairs from caches:', error);
            return [];
        }
    }

    /**
     * Creates a new cache entry with the specified cache name.
     * @param {string} cache_name The name of the cache to create.
     * @returns {Promise<void>} A Promise that resolves when the cache entry is successfully created.
     */
    async create_new_entry(cache_name: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await caches.open(cache_name);
                resolve(); 
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Deletes a cache entry with the specified name.
     * @param {string} cache_name The name of the cache to delete.
     * @returns {Promise<void>} A Promise that resolves when the cache entry is successfully deleted.
     */
    async delete_cache(cache_name: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const exists = await this.contains_cache(cache_name);
                if (exists) {
                    await caches.delete(cache_name);
                    resolve();
                } else {
                    reject();
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Checks if a cache entry with the specified name exists.
     * @param {string} cache_name The name of the cache to check.
     * @returns {Promise<boolean>} A Promise that resolves to true if the cache exists, false otherwise.
     */
    async contains_cache(cache_name: string): Promise<boolean> {
        return new Promise<boolean>(async (resovle, reject) => {
            try{
                const caches = await this.get_all_cache_names();
                resovle(caches.includes(cache_name));
            }catch(error){
                reject(error);
            }
        });
    }

    /**
     * Stores or overrides sa response in the specified cache under the given key.
     * @param {string} cache_name The name of the cache where the response will be stored.
     * @param {URL | RequestInfo} key The key under which to store the response.
     * @param {Response} response The response to store in the cache.
     * @returns {Promise<void>} A Promise that resolves when the response is successfully stored in the cache.
     */
    async set_cache(cache_name: string, key: URL | RequestInfo, response: Response): Promise<void>{
        return new Promise<void>(async (resolve, reject) => {
            try{
                if(cache_name === Globals.DEFAULT_CACHE_NAME){
                    reject('Default cache cant be updated');
                }

                caches.open(cache_name).then((cache) => {
                    cache.put(key, response).then(() => resolve());
                })
            }catch(error){
                reject(error);
            }
        });
    }

    /**
     * Downloads the contents of the specified cache as a ZIP file.
     * Each cached response is stored in the ZIP file under its respective folder and file name.
     * @param {string} cache_name The name of the cache to download.
     * @returns {Promise<void>} A Promise that resolves when the cache has been successfully downloaded.
     */
    async download_cache(cache_name: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const zip = new JSZip();
            const created_folders = new Map<string, JSZip>();

            try{

                const cache = await caches.open(cache_name);
                const requests = await cache.keys();

                await Promise.all(requests.map(async (request) => {
                    const response = await cache.match(request);

                    if(response){
                        const url = new URL(request.url);
                        const file_path = url.pathname;
                        const folders = file_path.split(/\/{1,2}/);

                        let current_folder = zip;

                        for(let i = 0; i < folders.length - 1; i++){
                            const folder_name = folders[i];

                            if(!created_folders.has(folder_name)){
                                created_folders.set(folder_name, current_folder.folder(folder_name)!);
                            }

                            current_folder = created_folders.get(folder_name)!;
                        }

                        const file_blob = await response.blob();
                        current_folder.file(folders[folders.length - 1], file_blob);
                    }
                }));

                const zip_content = await zip.generateAsync({type: 'blob'});

                const download_link = document.createElement('a');

                download_link.href = URL.createObjectURL(zip_content);
                download_link.download = `${cache_name}.zip`;
                download_link.style.display = 'none';

                document.body.appendChild(download_link);
                download_link.click();
                document.body.removeChild(download_link);

                resolve();

            }catch(error){
                reject(error);
            }
        })
    }
}
