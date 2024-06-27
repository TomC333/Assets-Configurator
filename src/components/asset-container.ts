import { CacheTypes } from "../utils/enums";
import { CacheAsset } from "../utils/types";

export class AssetContainer{

    static create_single_asset_container(asset: CacheAsset) {
        const div = document.createElement("div");

        switch(asset.type){
            case CacheTypes.IMAGE:
                const image = document.createElement('img');
                image.src = asset.value;
                image.alt = 'Cached Image';
                div.appendChild(image);
                break;
            case CacheTypes.VIDEO:
                const video = document.createElement('video');
                video.src = asset.value;
                video.controls = true;
                div.appendChild(video);
                break;
            case CacheTypes.AUDIO:
                const audio = document.createElement('audio');
                audio.src = asset.value;
                audio.controls = true;
                div.appendChild(audio);
                break;
            case CacheTypes.JSON:
                const jsonContent = document.createElement('pre');
                jsonContent.textContent = JSON.stringify(asset.value, null, 2);
                div.appendChild(jsonContent);
                break;
        }

        return div;
    }

}