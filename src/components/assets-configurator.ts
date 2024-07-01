import { Profile } from "../models/profile";
import { ClickActions } from "../utils/enums";
import { ActionHandler } from "../utils/types";
import { AssetsConfiguratorControllPanel } from "./assets-configurator-control-panel";
import { AssetsConfiguratorView } from "./assets-configurator-view";

export class AssetsConfigurator {

    private _configurator_view: AssetsConfiguratorView;
    private _configurator_controll_panel: AssetsConfiguratorControllPanel;

    private _on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void;

    constructor(on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void){
        this._on_click = on_click;

        this._configurator_view = new AssetsConfiguratorView(on_click);
        this._configurator_controll_panel = new AssetsConfiguratorControllPanel(on_click);
    }
    
    /**
     * Adds a new profile to the configurator control panel.
     * 
     * @param {Profile} profile The Profile object representing the new profile to add.
     */
    add_new_profile(profile: Profile): void{
        this._configurator_controll_panel.add_new_profile(profile);
    }

    /**
     * Updates the profiles view with the provided array of profiles.
     * @param profiles An array of Profile objects to be displayed.
     */
    set_profiles(profiles: Profile[]): void{
       this._configurator_controll_panel.set_profiles(profiles);
    }

     /**
     * Sets the active profile and updates the view with its assets.
     * @param profile The Profile object representing the active profile.
     */
    set_active_profile(profile: Profile): void{
        this._configurator_view.set_view(profile.get_cache_data());
    }
}