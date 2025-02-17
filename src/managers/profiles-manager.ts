import { Profile } from "../models/profile";

export class ProfilesManager{
    private _profiles: Map<string, Profile>;

    private _active_profile!: Profile;

    /**
     * Constructs a new ProfilesManager instance with an initial set of profile names.
     * @param profile_names An array of profile names to initialize the manager with.
     */
    constructor(profile_names: string[]) {
        this._profiles = new Map();

        this.init_profiles(profile_names);
    }

    /**
     * Initializes profiles in the manager based on an array of profile names.
     * @param profiles An array of profile names to initialize as profiles.
     */
    private init_profiles(profiles: string[]): void{
        profiles.forEach(profile => 
            {
                this._profiles.set(profile, new Profile(profile));
            }
        );
    }
    
    /**
     * Retrieves the profile associated with the specified profile name.
     * @param profile_name The name of the profile to retrieve.
     * @returns The Profile object associated with the profile name, or undefined if not found.
     */
    get_profile(profile_name: string): Profile | undefined { 
        return this._profiles.get(profile_name);
    }
    
    /**
     * Retrieves an array of all profiles managed by the ProfilesManager.
     * @returns An array containing all profiles managed by the manager.
     */
    get_profiles(): Profile[] {
        return Array.from(this._profiles.values());
    }

    /**
     * Checks if a profile with the given profile_name exists in the ProfilesManager
     * @param profile_name The name of the profile to check for existence.
     * @returns `true` if the profile exists in the manager, otherwise `false`.
     */
    contains(profile_name: string): boolean {
        return this._profiles.get(profile_name) !== undefined;
    }

    /**
     * Adds a new profile with the given name to the collection of profiles.
     * @param {string} profile_name The name of the profile to add.
     */
    add_profile(profile_name: string) {
        this._profiles.set(profile_name, new Profile(profile_name));
    }

    /**
     * Deletes a profile from the manager by its name.
     * @param profile_name The name of the profile to delete.
     */
    delete_profile(profile_name: string) {
        this._profiles.delete(profile_name);
    }

    /**
     * Stores the active profile.
     * @param profile The profile object to store as active.
     */
    set_active_profile(profile: Profile){
        this._active_profile = profile;
    }

    /**
     * Returns the currently active profile.
     * @returns The active profile object.
     */
    get_active_profile(): Profile{
        return this._active_profile;
    }
}