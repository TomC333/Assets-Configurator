import { Extenstions } from "../utils/extensions";
import { Globals} from "../utils/globals";
import { CacheManager } from "./cacheManager";
import { ComponentsManager } from "./componentsManager";
import { ProfilesManager } from "./profilesManager";
import { ServiceWorkerManager } from "./serviceWorkerManager";

export class AssetsManager{
    private _apiEndpoint: string;

    private _serviceWorkersManager: ServiceWorkerManager;
    private _componentsManager: ComponentsManager;
    private _profilesManager!: ProfilesManager;
    private _cacheManager: CacheManager;

    /**
     * Constructs a new instance of ServiceWorkerManager.
     * @param apiEndpoint The API endpoint URL for fetching the generated code of the service worker.
     *                    The endpoint URL should support either a query parameter or a path variable 'cache_name'
     *                    to specify the cache name dynamically.
     *                    Examples:
     *                    - Query parameter format: 'http://some_host:some_port/GetWorkerJS?cache_name='
     *                    - Passed argument to constructor:  'http://some_host:some_port/GetWorkerJS?cache_name='
     * 
     *                    - Path variable format: 'http://some_host:some_port/GetWorkerJS/{cache_name}'
     *                    - Passed argument to constructor:  'http://some_host:some_port/GetWorkerJS/'
     * 
     *                    The service worker generation should only require this parameter to function correctly.
     */
    constructor(apiEndpoint: string) {
        this._apiEndpoint = apiEndpoint;

        this._serviceWorkersManager = new ServiceWorkerManager();
        this._componentsManager = new ComponentsManager();
        this._cacheManager = new CacheManager();

        this._cacheManager.getAllCacheNames().then(cacheNames => {
            this._profilesManager = new ProfilesManager(cacheNames.map(name => Extenstions.cacheNameToProfileName(name)));
            this.init();
        });
    }   
       
    /**
     * Sets the active profile, updates the service worker, and updates the component view accordingly.
     * @param profileName The name of the profile to set as active.
     */
    private setActiveProfile(profileName: string){
        if(!this._profilesManager.contains(profileName)){
            console.error("There is no such profile");
            return;
        }

        const cacheName = Extenstions.profileNameToCacheName(profileName);
        const URL = Extenstions.generateAPIRequestURL(this._apiEndpoint, cacheName);
        
        this.setActiveServiceWorker(URL).then(_ => {
            this.setActiveProfileCacheToComponents(cacheName);
        });
    }

    /**
     * Registers a service worker with the provided serviceWorkerRequestURL asynchronously.
     * @param serviceWorkerRequestURL The URL of the service worker script to register.
     * @returns A Promise that resolves when the service worker is successfully registered.
     */
    private async setActiveServiceWorker(serviceWorkerRequestURL: string): Promise<void>{
        await this._serviceWorkersManager.registerServiceWorker(serviceWorkerRequestURL);
    }

    /**
     * Retrieves unique key-value pairs from both 'default' and 'override' caches,
     * prioritizing values from the 'override' cache if keys are identical.
     * Updates the assets view in the components manager.
     * @param defaultCacheName The name of the default cache.
     * @param overrideCacheName The name of the override cache.
     */
    private setActiveProfileCacheToComponents(cacheName: string): void{
        this._cacheManager.getUniqueCacheKeyValuePairs(Globals.DEFAULT_CACHE_NAME, cacheName).then(result => {
            this._componentsManager.updateAssetsView(result);
        });
    }

    /**
     * Initializes the application setup.
     * This method sets up necessary configurations for the application to function correctly.
     * It should be called during the initialization phase of the application.
     */
    private init(): void {
        this._componentsManager.setProfiles(this._profilesManager.getProfiles());

        this.setActiveProfile(Globals.DEFAULT_PROFILE_NAME);
    }

    /**
     * tmp function for testing purpose 
     * @param profileName 
     */
    onProfileClick(profileName: string) {
        this.setActiveProfile(profileName);
    }
}