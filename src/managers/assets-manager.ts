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
        [ClickActions.DELETE_PROFILE]: (profile_name) => {
            this._components_manager.show_loading_popup();
            this.try_to_delete_profile(profile_name);
        },
        [ClickActions.UPDATE_ASSET]: (key: string, file: File | null) => {
            this._components_manager.show_loading_popup();
            this.try_to_update_asset(key, file);
        },
        [ClickActions.UPDATE_ASSET_FROM_LINK]: (key: string, link: string) => {
            this._components_manager.show_loading_popup();
            this.try_to_update_asset_from_link(key, link);
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

        this.init();
    }   
    
    /**
     * Retrieves initial cache names, ensuring the default cache exists if necessary.
     * @returns {Promise<string[]>} A Promise that resolves to an array of cache names.
     * @private
     */
    private async get_initial_cache_names(): Promise<string[]>{
        return new Promise<string[]>(async (resolve, reject) => {
            try{
                await this._cache_manager.get_all_cache_names().then(async (caches) => {
                    if(caches.includes(Globals.DEFAULT_CACHE_NAME)){
                        resolve(caches);
                    }
    
                    await this._cache_manager.create_new_entry(Globals.DEFAULT_CACHE_NAME).then(() => {
                        this._local_storage_manager.set_item(Globals.LOCAL_STORAGE_PREVIOUS_PROFILE_KEY, Globals.DEFAULT_PROFILE_NAME);
                        caches.push(Globals.DEFAULT_CACHE_NAME);

                        resolve(caches);                        
                    });
                });
            }catch(error){
                reject(error);
            }
        });
    }

    /**
     * Determines the initial active profile based on previous settings or defaults.
     * @param {string[]} cache_names - An array of cache names.
     * @returns {string} The initial active profile name.
     * @private
     */
    private get_initial_profile(cache_names: string[]): string {
        const previous_profile = this._local_storage_manager.get_item(Globals.LOCAL_STORAGE_PREVIOUS_PROFILE_KEY);

        if(previous_profile !== null && cache_names.includes(Extenstions.profile_name_to_cache_name(previous_profile))){
            return previous_profile;
        }

        return Globals.DEFAULT_PROFILE_NAME;
    }
    
    /**
     * Initializes the manager by setting up cache names, profiles, and active components.
     * @returns {Promise<void>} A Promise that resolves when initialization is complete.
     * @private
     */
    private async init(): Promise<void> {

        return new Promise<void>(async (resolve, reject) => {
            try{
                await this.get_initial_cache_names().then((caches) => {
                    this._profiles_manager = new ProfilesManager(caches.map((x) => Extenstions.cache_name_to_profile_name(x)));
                    this._components_manager.set_profiles(this._profiles_manager.get_profiles());
    
                    const initial_profile = this.get_initial_profile(caches);
                    this.set_active_profile(initial_profile, `Welcome to Assets Configurator, ${initial_profile} is set as a Active Profile`);
    
                    resolve();
                });
            }catch(error){
                reject(error);
            }
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
            this._components_manager.end_loading_popup(`Profile with that name is already exists`);
            return;
        }

        this._cache_manager.create_new_entry(Extenstions.profile_name_to_cache_name(profile_name)).then(() => {
            this._local_storage_manager.set_item(Globals.LOCAL_STORAGE_PREVIOUS_PROFILE_KEY, profile_name);
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

        this.set_active_profile(profile_name, `Profile switched to -> ${profile_name} <- :)`);
    }

    /**
     * Tries to delete a profile from the cache and sets a new active profile if successful.
     * Displays appropriate messages if the profile does not exist or is not deletable.
     * 
     * @param {string} profile_name The name of the profile to delete.
     * @returns {void}
     * @private
     */
    private try_to_delete_profile(profile_name: string): void {
        if(!this._profiles_manager.contains(profile_name)){
            this._components_manager.end_loading_popup(`There is no such profile`);
            return;
        }

        if(this._profiles_manager.get_profile(profile_name)?.is_deletable){
            this._components_manager.end_loading_popup(`That profile is not deletable`)
            return;
        }

        this._cache_manager.delete_cache(profile_name).then(() => {
            this.set_active_profile(Globals.DEFAULT_PROFILE_NAME, `Profile deleted sucesfully, switching to ${Globals.DEFAULT_PROFILE_NAME}  profile`);
        });
    }

    /**
     * Checks if the asset update can proceed based on the provided link or file.
     * Displays appropriate messages and returns false if conditions are not met.
     * 
     * @param {string | File | null} link_or_file The link or File object representing the asset to update.
     * @returns {boolean} True if asset update can proceed; otherwise false.
     * @private
     */
    private can_asset_updated(link_or_file: string | File | null): boolean {

        if(typeof link_or_file === 'string' && link_or_file === ""){
            this._components_manager.end_loading_popup(`No link provided to update asset`);
            return false;
        }

        if(link_or_file === null){
            this._components_manager.end_loading_popup(`No file provided to update asset`);
            return false;
        }

        if(this._profiles_manager.get_active_profile().is_default()){
            this._components_manager.end_loading_popup(`Assets on default profile can't be overriden`);
            return false;
        }

        return true;
    }

    /**
     * Updates an asset in the active profile's cache with the provided value.
     * 
     * @param {string} key The key under which to update the asset in the cache.
     * @param {Response} value The Response object containing the asset data.
     * @private
     */
    private async update_asset(key: string, value: Response) {
        this._cache_manager.set_cache(Extenstions.profile_name_to_cache_name(this._profiles_manager.get_active_profile().get_profile_name()), key, value).then(() => {
            this.set_active_profile(this._profiles_manager.get_active_profile().get_profile_name(), `Cache update sucesfully`);
            // TO:DO change that logic, it's not necesarry to set profile again, it will be enough to change asset only 
        });
    }

    /**
     * Tries to update an asset in the active profile's cache with a new file fetched from a URL.
     * Displays appropriate messages if the link is empty, fetch fails, or updating cache fails.
     * 
     * @param {string} key The key under which to update the asset in the cache.
     * @param {string} link The URL from which to fetch the new asset.
     * @private
     */
    private async try_to_update_asset_from_link(key: string, link: string){
        if(!this.can_asset_updated(link)){
            return;
        }

        try {
            const response = await fetch(link);
            if (!response.ok) {
                this._components_manager.end_loading_popup(`Failed to fetch new asset`);
                return;
            }
            
            const blob = await response.blob();
            this.update_asset(key, new Response(blob));
            
        } catch (error) {
            this._components_manager.end_loading_popup(`Unexcepted error, can't updated assets`);
        }
    }

    /**
     * Tries to update an asset in the active profile's cache with a new file.
     * Displays appropriate messages if the file is not provided or is invalid.
     * 
     * @param {string} key The key under which to update the asset in the cache.
     * @param {File | null} file The file to update the asset with.
     * @private
     */
    private async try_to_update_asset(key: string, file: File | null){
        if(!this.can_asset_updated(file)){
            return;
        }

        this.update_asset(key, new Response(file));
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