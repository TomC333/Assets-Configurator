import { ClickActions } from "../utils/enums";
import { Extenstions } from "../utils/extensions";
import { Globals} from "../utils/globals";
import { ActionHandler } from "../utils/types";
import { CacheManager } from "./cache-manager";
import { ComponentsManager } from "./components-manager";
import { LocalStorageManager } from "./local-storage-manager";
import { ProfilesManager } from "./profiles-manager";
import { ServiceWorkerManager } from "./service-worker-manager";

export class AssetsManager{
    private _api_endpoint: string;

    private _service_workers_manager: ServiceWorkerManager;
    private _components_manager: ComponentsManager;
    private _profiles_manager!: ProfilesManager;
    private _cache_manager: CacheManager;
    private _local_storage_manager: LocalStorageManager;

    private _action_handlers: Record<ClickActions, ActionHandler<any>> = {
        [ClickActions.CREATE_NEW_PROFILE]: (profile_name: string) => {
            this._components_manager.show_loading_popup();
            this.try_to_create_profile(profile_name);
        },
        [ClickActions.SWITCH_PROFILE]: (profile_name: string) => {
            this._components_manager.show_loading_popup();
            this.try_to_switch_profile(profile_name);
        },
        [ClickActions.DELETE_PROFILE]: () => {
            this._components_manager.show_loading_popup();


            setTimeout(() => {
                this._components_manager.end_loading_popup("sorry but delete profiel function is not available right now");
            }, 5000);
        },
        [ClickActions.UPDATE_ASSET]: (key: string, file_list: FileList | null) => {
            this._components_manager.show_loading_popup();
            this.try_to_update_asset(key, file_list);
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
        this._local_storage_manager = new LocalStorageManager();

        this._components_manager.show_loading_popup();

        this._cache_manager.get_all_cache_names().then(cache_names => {
            this._profiles_manager = new ProfilesManager(cache_names.map(name => Extenstions.cache_name_to_profile_name(name)));
            this.init();
        });
    }   
       
    /**
     * Sets the active profile, updates the service worker, and updates the component view accordingly.
     * @param profile_name The name of the profile to set as active.
     */
    private set_active_profile(profile_name: string, message: string): void{
        this._components_manager.show_loading_popup();
        
        if(!this._profiles_manager.contains(profile_name)){
            this._components_manager.end_loading_popup(`There is no such profile`);
            return;
        }

        const cache_name = Extenstions.profile_name_to_cache_name(profile_name);
        const url = Extenstions.generate_api_request_url(this._api_endpoint, cache_name);
        
        this.set_active_service_worker(url).then(_ => {
            this._profiles_manager.set_active_profile(this._profiles_manager.get_profile(profile_name)!);
            this.set_active_profile_to_components(profile_name, cache_name);
            this._components_manager.end_loading_popup(message);
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

        this.set_active_profile(Globals.DEFAULT_PROFILE_NAME, `Wellcome to Assets Configurator, Default profile is active`);
    }

    /**
     * Tries to create a new profile with the given name.
     * If successful, sets the active profile and displays a success message.
     * If the profile name is empty, displays an error message.
     * If a profile with the same name already exists, displays an error message.
     * 
     * @param {string} profile_name The name of the profile to create.
     */
    private try_to_create_profile(profile_name: string): void {

        if(profile_name === ""){
            this._components_manager.end_loading_popup(`Enter user name firstly and try again`);
            return;
        }

        if(this._profiles_manager.contains(profile_name)){
            this._components_manager.end_loading_popup(`Profile with that name is already created`);
            return;
        }

        this._cache_manager.create_new_entry(Extenstions.profile_name_to_cache_name(profile_name)).then(() => {
            this._profiles_manager.add_profile(profile_name);
            this._components_manager.add_new_profile(this._profiles_manager.get_profile(profile_name)!);
            this.set_active_profile(profile_name, `Profile with name -> ${profile_name} <- created sucesfully`);
        });
    }

    /**
     * Tries to switch to the profile with the given name.
     * If the profile exists, sets it as the active profile and displays a success message.
     * If the profile does not exist, displays an error message.
     * 
     * @param {string} profile_name The name of the profile to switch to.
     */
    private try_to_switch_profile(profile_name: string): void {
        if(!this._profiles_manager.contains(profile_name)){
            this._components_manager.end_loading_popup(`There is no such profile`);
            return;
        }

        this.set_active_profile(profile_name, `Profile switched to -> ${profile_name} <-`);
    }

    private async try_to_update_asset(key: string, file_list: FileList | null){
        if(!file_list){
            this._components_manager.end_loading_popup(`Old asset preserved`);
            return;
        }

        const file = file_list[0];
        if(!file){
            this._components_manager.end_loading_popup(`Old asset preserved`);
            return;
        }

        await caches.open(Extenstions.profile_name_to_cache_name(this._profiles_manager.get_active_profiel().get_profile_name())).then(cache => {
            cache.put(key, new Response(file));
        });
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
            console.error(`Click event is not handled for ACTION -> ${action} <-`);
        }
    }
}