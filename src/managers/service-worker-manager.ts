export class ServiceWorkerManager {
    
    constructor() { 
        
    }

    /**
     * Registers a service worker with the provided serviceWorkerRequestURL.
     * If a service worker is already registered, it first unregisters the existing one.
     * @param service_worker_request_url The URL of the service worker script to register.
     * @returns A Promise that resolves once the service worker is successfully registered.
     */ 
    async register_service_worker(service_worker_request_url: string): Promise<void> {
        try {
            if ("serviceWorker" in navigator) {
                const existing_registration = await navigator.serviceWorker.getRegistration("/");
                
                if (existing_registration) {
                    await existing_registration.unregister();
                }

                const existing_registration2 = await navigator.serviceWorker.getRegistration("/");
                
                if (existing_registration2) {
                    await existing_registration2.unregister();
                }

                await navigator.serviceWorker.register(service_worker_request_url, { scope: "/" });
            } else {
                console.warn("Service workers are not supported");
            }
        } catch (error) {
            console.error("Error in registering service worker:", error);
        }
    }
}