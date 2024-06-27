import { CacheTypes } from "./enums"

export type CacheAsset = {
    type: CacheTypes,
    key: string,
    value: any,
}