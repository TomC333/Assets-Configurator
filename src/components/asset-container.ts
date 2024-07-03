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

    static create_asset_info_container(asset: CacheAsset): HTMLDivElement {
        const div = document.createElement('div');
        const p = document.createElement('p');

        p.classList.add('asset-key-container');
        p.innerText = asset.key;

        div.appendChild(p);

        return div;
    }

    static create_asset_settings_container(asset: CacheAsset, on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void): HTMLDivElement {
        const div = document.createElement('div');
        const file_input = document.createElement('input');
        const link_input = document.createElement('input');
        const save_button = document.createElement('div');
        const close_button = document.createElement('div');

        file_input.type = 'file';
        file_input.name = 'file-upload';

        link_input.type = 'text';
        link_input.placeholder = 'Enter asset link';

        switch (asset.type) {
            case CacheTypes.IMAGE:
                file_input.accept = 'image/*';
                break;
            case CacheTypes.VIDEO:
                file_input.accept = 'video/*';
                break;
            case CacheTypes.AUDIO:
                file_input.accept = 'audio/*';
                break;
            case CacheTypes.JSON:
                file_input.accept = '.json';
                break;
            default:
                file_input.accept = ''; 
                break;
        }

        save_button.innerText = "SAVE";
        save_button.classList.add('save-button', 'basic-button');

        close_button.innerText = "CLOSE";
        close_button.classList.add('close-button', 'basic-button');

        save_button.addEventListener('click', () => {
            const file = file_input.files ? file_input.files[0] : null;
            const link = link_input.value.trim();
            on_click(ClickActions.UPDATE_ASSET, asset.key, file, link, file_input.accept);

            file_input.value = '';
            link_input.value = '';
        });

        close_button.addEventListener('click', () => {
            div.classList.add('hidden');
        });

        div.appendChild(file_input);
        div.appendChild(link_input);
        div.appendChild(save_button);
        div.appendChild(close_button);

        return div;
    }

    static create_asset_container(asset: CacheAsset, on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void): HTMLDivElement {
        const div = document.createElement("div");
        const info = this.create_asset_info_container(asset);
        const settings = this.create_asset_settings_container(asset, on_click);
        const visual = this.create_asset_element(asset.type, asset.value);

        div.classList.add('asset-container');
        info.classList.add('asset-info');
        settings.classList.add('asset-settings');
        visual.classList.add('asset');

        div.appendChild(info);
        div.appendChild(settings);
        div.appendChild(visual);

        return div;
    }
}


