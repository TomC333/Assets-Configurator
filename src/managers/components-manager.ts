import { Profile } from "../models/profile";
import { CacheAsset } from "../utils/types";

export class ComponentsManager{
    
    private _assets_configurator_container: HTMLDivElement;
    private _assets_container: HTMLDivElement;

    constructor() {
        this._assets_configurator_container = document.querySelector(".assets-configurator-container") as HTMLDivElement;
        this._assets_container = this._assets_configurator_container.querySelector(".assets-container") as HTMLDivElement;
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
    update_assets_view(new_view: CacheAsset[]){
        // TO:DO
        console.log("ComponentsManager: update assets view call   newView -> ", new_view);
    }
}