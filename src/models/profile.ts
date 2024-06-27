import { Globals } from "../utils/globals";
import { CacheAsset } from "../utils/types";

export class Profile {
    private _profile_name: string;

    private _cache_data!: CacheAsset[];

    /**
     * Creates an instance of Profile.
     * @param profile_name The name of the profile.
     */
    constructor(profile_name: string){
        this._profile_name = profile_name;
    }

    /**
     * Sets the cache data with the provided array of CacheAsset objects.
     * @param cache_data An array of CacheAsset objects to set as the cache data.
     */
    set_cache_data(cache_data: CacheAsset[]){
        this._cache_data = cache_data;
    }

    /**
     * Retrieves the current cache data stored in this instance.
     * @returns An array of CacheAsset objects representing the current cache data.
     */
    get_cache_data(): CacheAsset[] {
        return this._cache_data;
    }

    /**
     * Checks if the profile is set as the default profile.
     * @returns True if the profile is the default profile; false otherwise.
     */
    is_default(): boolean {
        return this._profile_name === Globals.DEFAULT_PROFILE_NAME;
    }

    /**
     * Checks if the profile can be deleted.
     * Profiles other than the default profile are deletable.
     * @returns true if the profile can be deleted; false otherwise.
     */
    is_deletable(): boolean{
        return !this.is_default();
    }
}