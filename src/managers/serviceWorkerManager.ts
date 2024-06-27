export class ServiceWorkerManager {
    
    constructor() { 
        
    }

    /**
     * Registers a service worker with the provided serviceWorkerRequestURL.
     * If a service worker is already registered, it first unregisters the existing one.
     * @param serviceWorkerRequestURL The URL of the service worker script to register.
     * @returns A Promise that resolves once the service worker is successfully registered.
     */ 
    async registerServiceWorker(serviceWorkerRequestURL: string): Promise<void> {
        try {
            if ("serviceWorker" in navigator) {
                const existingRegistration = await navigator.serviceWorker.getRegistration("/");
                
                if (existingRegistration) {
                    await existingRegistration.unregister();
                }

                const existingRegistration2 = await navigator.serviceWorker.getRegistration("/");
                
                if (existingRegistration2) {
                    await existingRegistration2.unregister();
                }

                await navigator.serviceWorker.register(serviceWorkerRequestURL, { scope: "/" });
            } else {
                console.warn("Service workers are not supported");
            }
        } catch (error) {
            console.error("Error in registering service worker:", error);
        }
    }
}