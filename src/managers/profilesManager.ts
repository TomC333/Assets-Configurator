import { Profile } from "../models/profile";

export class ProfilesManager{
    private _profiles: Map<string, Profile>;

    /**
    * Constructs a new ProfilesManager instance with an initial set of profile names.
    * @param profileNames An array of profile names to initialize the manager with.
    */
    constructor(profileNames: string[]) {
        this._profiles = new Map();

        this.initProfiles(profileNames);
    }

    /**
    * Initializes profiles in the manager based on an array of profile names.
    * @param profiles An array of profile names to initialize as profiles.
    */
    private initProfiles(profiles: string[]): void{
        profiles.forEach(profile => 
            {
                this._profiles.set(profile, new Profile(profile));
            }
        );
    }
    
    /**
     * Retrieves an array of all profiles managed by the ProfilesManager.
     * @returns An array containing all profiles managed by the manager.
     */
    getProfiles(): Profile[] {
        return Object.values(this._profiles);
    }

    /**
     * Checks if a profile with the given profileName exists in the ProfilesManager.
     * @param profileName The name of the profile to check for existence.
     * @returns `true` if the profile exists in the manager, otherwise `false`.
     */
    contains(profileName: string): boolean {
        return this._profiles.get(profileName) !== undefined;
    }
}