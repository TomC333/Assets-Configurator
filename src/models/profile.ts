import { Globals } from "../utils/globals";

export class Profile {
    private _profile_name: string;

    /**
     * Creates an instance of Profile.
     * @param profile_name The name of the profile.
     */
    constructor(profile_name: string){
        this._profile_name = profile_name;
    }
    
    /**
     * Checks if the profile can be deleted.
     * Profiles other than the default profile are deletable.
     * @returns true if the profile can be deleted; false otherwise.
     */
    isDeletable(): boolean{
        return this._profile_name !== Globals.DEFAULT_PROFILE_NAME;
    }
}