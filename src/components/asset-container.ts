import { CacheTypes, ClickActions } from "../utils/enums";
import { ActionHandler, CacheAsset } from "../utils/types";

export class AssetContainer{

    /**
     * Creates an HTMLDivElement representing an asset element based on its type and value.
     * @param type The type of the cached asset (e.g., CacheTypes.IMAGE, CacheTypes.VIDEO, CacheTypes.AUDIO, CacheTypes.JSON).
     * @param value The value of the cached asset, specific to the type.
     * @returns HTMLDivElement representing the visual element of the cached asset.
     */
    private static create_asset_element(type: CacheTypes, value: any): HTMLDivElement{
        const div = document.createElement("div");

        switch(type){
            case CacheTypes.IMAGE:
                const image = document.createElement('img');
                image.src = value;
                image.alt = 'Cached Image';
                div.appendChild(image);
                break;
            case CacheTypes.VIDEO:
                const video = document.createElement('video');
                video.src = value;
                video.controls = true;
                div.appendChild(video);
                break;
            case CacheTypes.AUDIO:
                const audio = document.createElement('audio');
                audio.src = value;
                audio.controls = true;
                div.appendChild(audio);
                break;
            case CacheTypes.JSON:
                const json_content = document.createElement('pre');
                json_content.textContent = JSON.stringify(value, null, 2);
                div.appendChild(json_content);
                break;
            default:
                const p = document.createElement("p");
                p.innerText = "Unable to visualize cache type";
                div.appendChild(p);
                break;
        }

        return div;
    }

    /**
     * Creates an HTMLDivElement representing a popup element for editing or updating a cached asset.
     * @param key The key or identifier of the cached asset.
     * @param type The type of the cached asset (e.g., CacheTypes.IMAGE, CacheTypes.VIDEO, CacheTypes.AUDIO, CacheTypes.JSON).
     * @param value The value of the cached asset, specific to the type.
     * @param on_click Function to handle click actions on the popup (e.g., updating the asset).
     * @returns HTMLDivElement representing the popup element for the cached asset.
     */
    private static create_asset_popup_element(key: string, type: CacheTypes, value: any, on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void): HTMLDivElement{
        const div = document.createElement('div');
        const asset_element = this.create_asset_element(type, value);
        const file_input = document.createElement('input');
        const save_button = document.createElement('div');
        const close_button = document.createElement('div');

        asset_element.classList.add('popup-asset');

        file_input.type = 'file';
        file_input.name = 'file-upload';
        file_input.accept = 'audio/*,video/*,image/*';

        save_button.innerText = "SAVE";
        save_button.classList.add('save-button', 'basic-button');

        close_button.innerText = "CLOSE";
        close_button.classList.add('close-button', 'basic-button');

        save_button.addEventListener('click', () => {
            on_click(ClickActions.UPDATE_ASSET, key, file_input.files);
        });

        close_button.addEventListener('click', () => {
            div.classList.add('hidden');
        });

        div.appendChild(asset_element);
        div.appendChild(file_input);
        div.appendChild(save_button);
        div.appendChild(close_button);

        return div;
    }

    /**
     * Creates an HTMLDivElement representing a container for a cached asset.
     * 
     * TO:DO -> add update button <-
     * 
     * @param asset The cached asset object containing type and value.
     * @returns HTMLDivElement representing the container for the cached asset.
     */ 
    static create_asset_container(asset: CacheAsset, on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void): HTMLDivElement {
        const div = document.createElement("div");
        const visual = this.create_asset_element(asset.type, asset.value);
        const popup = this.create_asset_popup_element(asset.key, asset.type, asset.value, on_click);

        popup.classList.add('asset-container-popup', 'hidden');
        div.classList.add('asset-container');
        visual.classList.add('asset');

        div.appendChild(visual);
        div.appendChild(popup);


        visual.addEventListener('click', () => {
            popup.classList.remove('hidden');
        });

        return div;
    }
}


