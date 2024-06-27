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
    async getAllCacheNames(): Promise<string[]> {
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
     * @param defaultCache The name of the default cache.
     * @param overrideCache The name of the override cache.
     * @returns A promise that resolves with an array of unique key-value pairs from both caches.
     *          If either cache does not exist or cannot be accessed, resolves with an empty array.
     */
    async getUniqueCacheKeyValuePairs(defaultCache: string, overrideCache: string): Promise<any[]> {
        if (!('caches' in window)) {
            console.error('Cache API is not supported');
            return [];
        }

        try {
            const cache1 = await caches.open(defaultCache);
            const cache2 = await caches.open(overrideCache);

            const cache1Keys = await cache1.keys();
            const cache2Keys = await cache2.keys();

            const uniqueKeys = new Set<string>();

            cache1Keys.forEach(request => uniqueKeys.add(request.url));
            cache2Keys.forEach(request => uniqueKeys.add(request.url));

            const uniqueKeyArray = Array.from(uniqueKeys);

            const keyValuePairs = await Promise.all(uniqueKeyArray.map(async (key) => {
                const responseFromCache2 = await cache2.match(key);
                const response = responseFromCache2 ?? await cache1.match(key);
                
                if (response) {
                    // Check the content type of the response
                    const contentType = response.headers.get('Content-Type');
                    
                    if (contentType) {
                        let type: CacheTypes;
                        let value; 

                        if (contentType.match(/^image\//)) {
                            const blob = await response.blob();

                            value = URL.createObjectURL(blob);
                            type = CacheTypes.IMAGE;

                        } else if (contentType.match(/^audio\//)) {
                            const blob = await response.blob();
                            
                            value = URL.createObjectURL(blob);
                            type = CacheTypes.AUDIO;

                        } else if (contentType.match(/^video\//)) {
                            const blob = await response.blob();

                            value = URL.createObjectURL(blob);
                            type = CacheTypes.VIDEO;

                        } else if (contentType.match(/^application\/json/)) {
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

            const filteredKeyValuePairs = keyValuePairs.filter(pair => pair !== null);

            return filteredKeyValuePairs;
        } catch (error) {
            console.error('Error retrieving key-value pairs from caches:', error);
            return [];
        }
    }
}
