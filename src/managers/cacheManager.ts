export class CacheManager{

    private static _instance: CacheManager | null = null;

    private constructor() { }

    static getInstance(): CacheManager {
        if(this._instance === null){
            this._instance = new CacheManager();
        }
        return this._instance;
    }

}