import { Globals } from "../utils/globals";

export class Profile {
    private _profileName: string;

    /**
     * Creates an instance of Profile.
     * @param profileName The name of the profile.
     */
    constructor(profileName: string){
        this._profileName = profileName;
    }
    
    /**
     * Checks if the profile can be deleted.
     * Profiles other than the default profile are deletable.
     * @returns true if the profile can be deleted; false otherwise.
     */
    isDeletable(): boolean{
        return this._profileName !== Globals.DEFAULT_PROFILE_NAME;
    }
}