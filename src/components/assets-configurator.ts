import { Profile } from "../models/profile";
import { ClickActions } from "../utils/enums";
import { ActionHandler, CacheAsset } from "../utils/types";
import { AssetContainer } from "./asset-container";

export class AssetsConfigurator {

    private _assets_container: HTMLDivElement;

    private _on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void;

    constructor(on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void){
        this._assets_container = document.querySelector(".assets-container") as HTMLDivElement;

        this._on_click = on_click;
    }
    
    /**
     * Updates the profiles view accordingly.
     * @param profiles The array of profiles to set.
     */
    set_profiles(profiles: Profile[]): void{
        console.log("ComponentsManager: set profiles call   profiles -> ", profiles);
    }

    /**
     * Sets the active profile and updates the view with new assets.
     * @param profile The profile object representing the active profile.
     * @param new_view An array of CacheAsset objects representing the assets to display.
     */
    set_active_profile(profile: Profile, new_view: CacheAsset[]): void{
        this._assets_container.innerHTML = "";

        new_view.forEach(x => {
            this._assets_container.appendChild(AssetContainer.create_asset_container(x));
        });
    }
}