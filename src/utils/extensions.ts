import path from "path";
import { Globals } from "./globals";

/**
 * Utility class containing static methods for various operations.
 */
export class Extenstions{
    /**
     * Generates a cache name by combining the provided `cache_name` with default prefix and suffix.
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

    /**
     * Extracts the directory path from a file path string.
     * @param filePath The file path from which to extract the directory path.
     * @returns The directory path extracted from the file path.
     */
    static extract_directory(path: string): string {
        const parts = path.split(/[\/\\]/);
        const directory_path = parts.slice(0, -1).join('/');

        return directory_path;
    }

    /**
     * Retrieves unique subdirectories from a list of file paths.
     * @param paths The list of file paths from which to extract unique subdirectories.
     * @returns An array of unique subdirectories extracted from the file paths.
     */
    static get_unique_subdirecotires(paths: string[]): string[] {
        const sub_directories: Set<string> = new Set();

        paths.forEach(path => {
            const directory = Extenstions.extract_directory(path);
            sub_directories.add(directory);
        });

        return Array.from(sub_directories);
    }
}
