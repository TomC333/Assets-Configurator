import { CacheTypes } from "../utils/enums";
import { CacheAsset } from "../utils/types";

export class AssetContainer{

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

    static create_asset_container(asset: CacheAsset): HTMLDivElement {
        const div = document.createElement("div");
        const visual = this.create_asset_element(asset.type, asset.value);

        div.classList.add("asset-container");
        visual.classList.add("asset");

        div.appendChild(visual);

        return div;
    }
}