import { profile } from "console";
import { ClickActions } from "../utils/enums";
import { Extenstions } from "../utils/extensions";
import { Globals} from "../utils/globals";
import { ActionHandler, CacheAsset } from "../utils/types";
import { CacheManager } from "./cache-manager";
import { ComponentsManager } from "./components-manager";
import { ProfilesManager } from "./profiles-manager";
import { ServiceWorkerManager } from "./service-worker-manager";

export class AssetsManager{
    private _api_endpoint: string;

    private _service_workers_manager: ServiceWorkerManager;
    private _components_manager: ComponentsManager;
    private _profiles_manager!: ProfilesManager;
    private _cache_manager: CacheManager;

    
    private _action_handlers: Record<ClickActions, ActionHandler<any>> = {
        [ClickActions.CREATE_NEW_PROFILE]: (profile_name: string) => {
            console.log('Handling CREATE_NEW_PROFILE action... ', profile_name);
        },
        [ClickActions.SWITCH_PROFILE]: (profile_name: string) => {
            console.log('Handling SWITCH_PROFILE action...  ', profile_name);
        },
        [ClickActions.DELETE_PROFILE]: (profile_name: string) => {
            console.log('Handling DELETE_PROFILE action...  ', profile_name);
        }
    };


    /**
     * Constructs a new instance of ServiceWorkerManager.
     * @param api_endpoint The API endpoint URL for fetching the generated code of the service worker.
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
    constructor(api_endpoint: string) {
        this._api_endpoint = api_endpoint;

        this._service_workers_manager = new ServiceWorkerManager();
        this._components_manager = new ComponentsManager(this.on_click.bind(this));
        this._cache_manager = new CacheManager();

        this._cache_manager.get_all_cache_names().then(cache_names => {
            this._profiles_manager = new ProfilesManager(cache_names.map(name => Extenstions.cache_name_to_profile_name(name)));
            this.init();
        });
    }   
       
    /**
     * Sets the active profile, updates the service worker, and updates the component view accordingly.
     * @param profile_name The name of the profile to set as active.
     */
    private set_active_profile(profile_name: string): void{
        if(!this._profiles_manager.contains(profile_name)){
            console.error("There is no such profile");
            return;
        }

        const cache_name = Extenstions.profile_name_to_cache_name(profile_name);
        const url = Extenstions.generate_api_request_url(this._api_endpoint, cache_name);
        
        this.set_active_service_worker(url).then(_ => {
            this.set_active_profile_to_components(profile_name, cache_name);
        });
    }

    /**
     * Registers a service worker with the provided service_worker_request_url asynchronously.
     * @param service_worker_request_url The URL of the service worker script to register.
     * @returns A Promise that resolves when the service worker is successfully registered.
     */
    private async set_active_service_worker(service_worker_request_url: string): Promise<void>{
        await this._service_workers_manager.register_service_worker(service_worker_request_url);
    }

    /**
     * Updates the active profile's cached assets in components based on a specified cache.
     * Retrieves key-value pairs from the specified cache and updates the assets view accordingly.
     * @param profile_name The name of the profile which should become active.
     * @param cache_name The name of the cache from which key-value pairs are retrieved.
     */
    private set_active_profile_to_components(profile_name: string, cache_name: string): void{
        this._cache_manager.get_unique_cache_key_value_pairs(Globals.DEFAULT_CACHE_NAME, cache_name).then(result => {
            this._profiles_manager.get_profile(profile_name)?.set_cache_data(result);
            this._components_manager.set_active_profile(this._profiles_manager.get_profile(profile_name)!);
        });
    }

    /**
     * Initializes the application setup.
     * This method sets up necessary configurations for the application to function correctly.
     * It should be called during the initialization phase of the application.
     */
    private init(): void {
        this._components_manager.set_profiles(this._profiles_manager.get_profiles());

        this.set_active_profile(Globals.DEFAULT_PROFILE_NAME);
    }

    
    /**
     * Executes the appropriate handler function for a given action based on ClickActions enum.
     * Throws an error if the action is not handled.
     * 
     * @param {ClickActions} action The action to perform, represented by a value from the ClickActions enum.
     * @param {...any} args Arguments to pass to the handler function associated with the action.
     * @logs an error if the action is not handled by any registered handler.
     */
    on_click(action: ClickActions, ...args: Parameters<ActionHandler<any>>): void {
        const handler = this._action_handlers[action];

        if(handler){
            handler(...args);
        }else{
            console.error(`Click event is not handled for ACTION = ${action}`);
        }
    }
}