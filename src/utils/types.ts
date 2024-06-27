import { CacheTypes } from "./enums"

export type ActionHandler<A extends any[]> = (...args: A) => void;

export type CacheAsset = {
    type: CacheTypes,
    key: string,
    value: any,
}

export type AssetContainerParameter = {
    asset: CacheAsset,
    is_button_enabled: boolean,
    message_on_disabled_button: string,
}