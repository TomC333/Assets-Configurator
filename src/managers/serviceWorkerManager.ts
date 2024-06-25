export class ServiceWorkerManager {
    
    constructor() { 
        
    }

    /**
     * Registers a service worker with the provided serviceWorkerRequestURL.
     * If a service worker is already registered, it first unregisters the existing one.
     * @param serviceWorkerRequestURL The URL of the service worker script to register.
     * @returns A Promise that resolves once the service worker is successfully registered.
     */
    registerServiceWorker(serviceWorkerRequestURL: string): any{
        if("serviceWorker" in navigator){
            navigator.serviceWorker.getRegistration().then(existingRegistration => 
                {
                    if(existingRegistration){
                        return existingRegistration.unregister();
                    }
                }
            ).then(() => 
                {
                return navigator.serviceWorker.register(serviceWorkerRequestURL, {scope: "/"});
                }
            ).then(() => {
            }).catch(error => {
                console.error(error);
            });
        }else{
            console.warn("Service workers are not supported");
        }        
    }
}