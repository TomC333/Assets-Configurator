import { Extenstions } from "./extensions";

export const DEFAULT_CACHE_PREFIX = "next-level-";
export const DEFAULT_CACHE_SUFFIX = "-cache";

export const DEFAULT_PROFILE_NAME = "default";
export const DEFAULT_CACHE_NAME = Extenstions.profileNameToCacheName(DEFAULT_PROFILE_NAME);
