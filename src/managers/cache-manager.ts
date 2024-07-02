import { CacheTypes } from "../utils/enums";

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
     * 
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
     * 
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
     * 
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
     * 
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

    async set_cache(cache_name: string, key: URL | RequestInfo, response: Response): Promise<void>{
        return new Promise<void>(async (resolve, reject) => {
            try{
                caches.open(cache_name).then((cache) => {
                    cache.put(key, response).then(() => resolve());
                })
            }catch(error){
                reject(error);
            }
        });
    }
}
