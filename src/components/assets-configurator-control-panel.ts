import { ClickActions } from "../utils/enums";
import { ActionHandler } from "../utils/types";

export class AssetsConfiguratorControllPanel {
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

        const new_profile_name_input = document.getElementById("new-profile-name-input") as HTMLDivElement;

        create_new_profile_button.addEventListener("click", () => {
            this._on_click(ClickActions.CREATE_NEW_PROFILE, new_profile_name_input.innerText);
        });

        delete_profile_button.addEventListener("click", () => {
            this._on_click(ClickActions.DELETE_PROFILE);
        });
    }
}