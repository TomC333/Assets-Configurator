import { Globals } from "./globals";

/**
 * Utility class containing static methods for various operations.
 */
export class Extenstions{
    /**
     * Generates a cache name by combining the provided `cacheName` with default prefix and suffix.
     * @param cache_name The base name to be used in generating the cache name.
     * @returns The generated cache name with default prefix and suffix.
     */
    static generate_cache_name(cache_name: string): string{
        return Globals.DEFAULT_CACHE_PREFIX + cache_name + Globals.DEFAULT_CACHE_SUFFIX;
    }
    
    /**
     * Generates an API request URL by appending the `cacheName` to the `apiEndpoint`.
     * @param api_endpoint The base API endpoint to append the cache name.
     * @param cache_name The cache name to be appended to the API endpoint.
     * @returns The complete API request URL with the appended cache name.
     */
    static generate_api_request_url(api_endpoint: string, cache_name: string): string{
        return api_endpoint + cache_name;
    }

    /**
     * Converts a cache name to a profile name by removing the default prefix and suffix.
     * @param cache_name The cache name to be converted to a profile name.
     * @returns The profile name extracted from the cache name.
     */
    static cache_name_to_profile_name(cache_name: string): string {
        let profile_name = cache_name.replace(new RegExp(`^${Globals.DEFAULT_CACHE_PREFIX}`, 'i'), '');
        profile_name = profile_name.replace(new RegExp(`${Globals.DEFAULT_CACHE_SUFFIX}$`, 'i'), '');
    
        return profile_name;
    }

    /**
     * Converts a profile name to a cache name by prepending the default prefix and appending the suffix.
     * @param profile_name The profile name to be converted to a cache name.
     * @returns The cache name generated from the profile name.
     */
    static profile_name_to_cache_name(profile_name: string): string {
        return Globals.DEFAULT_CACHE_PREFIX + profile_name + Globals.DEFAULT_CACHE_SUFFIX;
    }
}
