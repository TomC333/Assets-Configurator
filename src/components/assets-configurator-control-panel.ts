import { Profile } from "../models/profile";
import { ClickActions } from "../utils/enums";
import { ActionHandler } from "../utils/types";

export class AssetsConfiguratorControllPanel {

    private _profiles_container: HTMLDivElement = document.querySelector(".profiles-container") as HTMLDivElement;

    private _on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void;
    
    constructor(on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void) {
        this._on_click = on_click;
    
        this.initButtonListeners();
    }

    /**
     * Initializes event listeners for buttons in the control panel.
     * - Handles events for creating a new profile and deleting a profile.
     * - Retrieves input data for creating a new profile.
     */
    private initButtonListeners(): void {
        const create_new_profile_button = document.querySelector(".create-new-profile-button") as HTMLDivElement;
        const delete_profile_button = document.querySelector(".delete-profile-button") as HTMLDivElement;

        const new_profile_name_input = document.getElementById("new-profile-name-input") as HTMLInputElement;

        create_new_profile_button.addEventListener("click", () => {
            this._on_click(ClickActions.CREATE_NEW_PROFILE, new_profile_name_input.value);
        });

        delete_profile_button.addEventListener("click", () => {
            this._on_click(ClickActions.DELETE_PROFILE);
        });
    }

    /**
     * Creates an HTMLDivElement representing an assets profile.
     * @param profile The profile data used to create the element.
     * @returns The created HTMLDivElement.
     */
    private create_assets_profile(profile: Profile): HTMLDivElement{
        const div = document.createElement('div');

        div.innerText = profile.get_profile_name();
    
        return div;
    }


    /**
     * Adds a new profile as an assets profile element to the profiles container.
     * Sets up click event handling to activate the profile when clicked.
     * 
     * @param {Profile} profile The Profile object representing the profile to add.
     * @param {boolean} is_active Optional. Specifies if the profile should be initially active (default: false).
     */
    add_new_profile(profile: Profile, is_active: boolean = false): void{
        const element = this.create_assets_profile(profile);

        element.classList.add("assets-profile");
        if(is_active){
            element.classList.add("active");
        }

        element.addEventListener('click', () => {
            if(!element.classList.contains("active")){
                this._profiles_container.querySelectorAll(".assets-profile").forEach((y) => y.classList.remove("active"));
                element.classList.add("active");
                this._on_click(ClickActions.SWITCH_PROFILE, profile.get_profile_name());
            }
        });

        this._profiles_container.appendChild(element);
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
        this._profiles_container.querySelectorAll('.assets-profile').forEach((x) => {
            x.classList.remove('active');
            if(x.textContent === profile.get_profile_name()){
                x.classList.add('active');
            }
        });   
    }
}