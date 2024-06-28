import { AssetsConfigurator } from "../components/assets-configurator";
import { LoadingPopup } from "../components/loading-popup";
import { Profile } from "../models/profile";
import { ClickActions } from "../utils/enums";
import { ActionHandler, CacheAsset } from "../utils/types";

export class ComponentsManager{

    private _assets_configurator: AssetsConfigurator;

    private _on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void;

    /**
     * Constructs an instance of AssetContainer with an optional onClick handler.
     * @param on_click A function to handle click actions with a specific signature.
     */
    constructor(on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void) {
        this._assets_configurator = new AssetsConfigurator(on_click);
        
        this._on_click = on_click;

        LoadingPopup.init();
    }

    /**
     * Sets the profiles to be displayed in the AssetsConfigurator.
     * @param profiles An array of Profile objects representing different user profiles.
     */
    set_profiles(profiles: Profile[]): void{
        this._assets_configurator.set_profiles(profiles);
    }

    /**
     * Sets the active profile and updates the displayed assets view accordingly.
     * @param profile The active profile to set.
     */
    set_active_profile(profile: Profile): void{
        this._assets_configurator.set_active_profile(profile);
    }

    /**
     * Displays the loading popup with a loading animation.
     */
    show_loading_popup(): void{
        LoadingPopup.show_loading_animation();
    }

    /**
     * Ends the loading popup animation and displays a message.
     * @param message The message to display when loading ends.
     */
    end_loading_popup(message: string): void{
        LoadingPopup.end_loading_animation(message);
    }
}