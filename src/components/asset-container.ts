import { CacheTypes } from "../utils/enums";
import { CacheAsset } from "../utils/types";

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
     * Creates an HTMLDivElement representing a container for a cached asset.
     * 
     * TO:DO -> add update button <-
     * 
     * @param asset The cached asset object containing type and value.
     * @returns HTMLDivElement representing the container for the cached asset.
     */
    static create_asset_container(asset: CacheAsset): HTMLDivElement {
        const div = document.createElement("div");
        const visual = this.create_asset_element(asset.type, asset.value);

        div.classList.add("asset-container");
        visual.classList.add("asset");

        div.appendChild(visual);

        return div;
    }
}