import { Globals } from "./globals";

/**
 * Utility class containing static methods for various operations.
 */
export class Extenstions{
    /**
     * Generates a cache name by combining the provided `cacheName` with default prefix and suffix.
     * @param cacheName The base name to be used in generating the cache name.
     * @returns The generated cache name with default prefix and suffix.
     */
    static generateCacheName(cacheName: string): string{
        return Globals.DEFAULT_CACHE_PREFIX + cacheName + Globals.DEFAULT_CACHE_SUFFIX;
    }
    
    /**
     * Generates an API request URL by appending the `cacheName` to the `apiEndpoint`.
     * @param apiEndpoint The base API endpoint to append the cache name.
     * @param cacheName The cache name to be appended to the API endpoint.
     * @returns The complete API request URL with the appended cache name.
     */
    static generateAPIRequestURL(apiEndpoint: string, cacheName: string): string{
        return apiEndpoint + cacheName;
    }

    /**
     * Converts a cache name to a profile name by removing the default prefix and suffix.
     * @param cacheName The cache name to be converted to a profile name.
     * @returns The profile name extracted from the cache name.
     */
    static cacheNameToProfileName(cacheName: string): string {
        let profileName = cacheName.replace(new RegExp(`^${Globals.DEFAULT_CACHE_PREFIX}`, 'i'), '');
        profileName = profileName.replace(new RegExp(`${Globals.DEFAULT_CACHE_SUFFIX}$`, 'i'), '');
    
        return profileName;
    }

    /**
     * Converts a profile name to a cache name by prepending the default prefix and appending the suffix.
     * @param profileName The profile name to be converted to a cache name.
     * @returns The cache name generated from the profile name.
     */
    static profileNameToCacheName(profileName: string): string {
        return Globals.DEFAULT_CACHE_PREFIX + profileName + Globals.DEFAULT_CACHE_SUFFIX;
    }
}
