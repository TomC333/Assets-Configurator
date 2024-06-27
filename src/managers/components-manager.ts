import { Profile } from "../models/profile";

export class ComponentsManager{
    
    constructor() {

    }

    /**
     * Updates the profiles view accordingly.
     * @param profiles The array of profiles to set.
     */
    set_profiles(profiles: Profile[]): void{
        // TO:DO
        console.log("ComponentsManager: set profiles call   profiles -> ", profiles);
    }

    /**
     * Updates the listed assets view on the screen with the provided new view data.
     * @param new_view The new array of assets view data to update.
     */
    update_assets_view(new_view: any[]){
        // TO:DO
        console.log("ComponentsManager: update assets view call   newView -> ", new_view);
    }
}