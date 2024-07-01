import { Profile } from "../models/profile";
import { ClickActions } from "../utils/enums";
import { ActionHandler, CacheAsset } from "../utils/types";
import { AssetContainer } from "./asset-container";

export class AssetsConfiguratorView{

    private _assets_container: HTMLDivElement;

    private _on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void;

    constructor(on_click: (action: ClickActions, ...args: Parameters<ActionHandler<any>>) => void)  {
        this._assets_container = document.querySelector(".assets-container") as HTMLDivElement;

        this._on_click = on_click;
    }

    /**
     * Sets the view with the provided array of cache assets, clearing the existing content.
     * @param view An array of CacheAsset objects representing assets to display.
     */
    set_view(view: CacheAsset[]): void {
        this._assets_container.innerHTML = "";

        view.forEach(x => {
            this._assets_container.appendChild(AssetContainer.create_asset_container(x));
        });
    }
}