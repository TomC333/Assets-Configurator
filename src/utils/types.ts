import { CacheTypes } from "./enums"

export type ActionHandler<A extends any[]> = (...args: A) => void;

export type CacheAsset = {
    type: CacheTypes,
    key: string,
    value: any,
}
