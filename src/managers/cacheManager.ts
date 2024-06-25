export class CacheManager{

    constructor() {

    }

    /**
    * Retrieves an array of all cache names available in the Cache API.
    * If the Cache API is not supported, logs an error message and returns an empty array.
    * @returns An array of cache names available in the Cache API, or an empty array if the Cache API is not supported.
    */
    getAllCacheNames(): string[] {
        if(!('cache' in window)){
            console.error('Cache API is not supported');
            
            return [];
        }

        const result: string[] = [];
        caches.keys().then(cacheNames => 
            {
                cacheNames.forEach(name => result.push(name));
            }
        ).catch(error => 
            {
                console.log("Error while trying to get cache names -> ", error);
            }
        );

        return result;
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
                const response = await cache2.match(key) ?? await cache1.match(key);
                if (response) {
                    const responseData = await response.json();
                    return { key, value: responseData };
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
