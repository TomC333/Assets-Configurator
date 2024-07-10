import { Profile } from "../models/profile";
import { ClickActions } from "../utils/enums";
import { ActionHandler } from "../utils/types";

export class AssetsConfiguratorControllPanel {

    private _profiles_selector: HTMLSelectElement = document.getElementById("profile-selector") as HTMLSelectElement;
    private _assets_filter_selector: HTMLSelectElement = document.getElementById("assets-filter-selector") as HTMLSelectElement;

    private _on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void;
    private _on_filter_click: (filter: string) => void;

    constructor(on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void, on_filter_click: (filter: string) => void) {
        this._on_click = on_click;
        this._on_filter_click = on_filter_click;

        this.init_button_listeners();
        this.init_selector_listeners();
    }

    /**
     * Initializes event listeners for selector elements in the control panel.
     * - Listens for changes in the profiles selector and triggers actions accordingly.
     * - Listens for changes in the assets filter selector and triggers filter actions.
     */
    private init_selector_listeners(){
        this._profiles_selector.addEventListener('change', (event) => {
            const selected_profile = (event.target as HTMLSelectElement).value;

            this._on_click(ClickActions.SWITCH_PROFILE, selected_profile);
        });

        this._assets_filter_selector.addEventListener('change', (event) => {
            const selected_filter = (event.target as HTMLSelectElement).value;

            this._on_filter_click(selected_filter);
        });
    }

    /**
     * Initializes event listeners for buttons in the control panel.
     * - Handles events for creating a new profile, deleting a profile and downloading cache data.
     * - Retrieves input data for creating a new profile.
     */
    private init_button_listeners(): void {
        const create_new_profile_button = document.querySelector(".create-new-profile-button") as HTMLDivElement;
        const delete_profile_button = document.querySelector(".delete-profile-button") as HTMLDivElement;
        const download_button = document.querySelector(".download-button") as HTMLDivElement;

        const new_profile_name_input = document.getElementById("new-profile-name-input") as HTMLInputElement;

        create_new_profile_button.addEventListener("click", () => {
            this._on_click(ClickActions.CREATE_NEW_PROFILE, new_profile_name_input.value);
        });

        delete_profile_button.addEventListener("click", () => {
            this._on_click(ClickActions.DELETE_PROFILE);
        });

        download_button.addEventListener("click", () => {
            this._on_click(ClickActions.DOWNLOAD_ASSETS);
        })
    }

    /**
     * Adds a new profile as an assets profile element to the profiles container.
     * @param {Profile} profile The Profile object representing the profile to add.
     * @param {boolean} is_active Optional. Specifies if the profile should be initially active (default: false).
     */
    add_new_profile(profile: Profile, is_active: boolean = false): void{
        const new_option = document.createElement('option');
        
        new_option.value = profile.get_profile_name();
        new_option.text = profile.get_profile_name();

        this._profiles_selector.appendChild(new_option);

        if(is_active){
            this._profiles_selector.value = new_option.value;
        }
    }

    /**
     * Sets the profiles in the container.
     * @param profiles Array of Profile objects to be displayed.
     */
    set_profiles(profiles: Profile[]): void{
        profiles.forEach((x) => {
            this.add_new_profile(x);
        });
    }

    /**
     * Sets the active profile in a container of profile elements based on the profile name.
     * @param profile The profile object containing the profile name to activate.
     */
    set_active_profile(profile: Profile): void{
        this._profiles_selector.value = profile.get_profile_name();
    }

    /**
     * Deletes a profile option from the profiles selector dropdown based on the profile object provided.
     * If the profile option exists in the selector, it is removed; otherwise, the function does nothing.
     * @param profile The Profile object representing the profile to delete.
     */
    delete_profile(profile: Profile): void{
        const option_to_delete = this._profiles_selector.querySelector(`option=[value=${profile.get_profile_name()}]`);

        if(option_to_delete){
            this._profiles_selector.removeChild(option_to_delete);
        }
    }


    /**
     * Sets the filters in the assets filter selector dropdown based on the provided array of filter strings.
     * Clears existing options and adds new options for each filter in the array.
     * @param filters An array of strings representing the filters to populate in the selector.
     */
    set_filters(filters: string[]): void{
        this._assets_filter_selector.innerHTML = "";
        this._assets_filter_selector.value = "";

        filters.forEach(filter => {
            const option = document.createElement('option');

            option.value = filter;
            option.text = filter;
        
            this._assets_filter_selector.appendChild(option);
        });
    }
}   