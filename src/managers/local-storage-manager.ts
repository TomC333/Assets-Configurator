export class LocalStorageManager{

    constructor() {

    }

    /**
     * Sets an item in the localStorage.
     * @param {string} key - The key under which to store the value.
     * @param {string} value - The value to store.
     */
    set_item(key: string, value: string): void{
        localStorage.setItem(key, value);
    }

    /**
     * Retrieves an item from the localStorage.
     * @param {string} key - The key of the item to retrieve.
     * @returns {string | null} The stored value, or null if the key does not exist.
     */
    get_item(key: string): string | null {
        return localStorage.getItem(key);
    }

    /**
     * Checks if an item exists in the localStorage.
     * @param {string} key - The key to check.
     * @returns {boolean} True if the key exists, false otherwise.
     */
    contains(key: string): boolean {
        return this.get_item(key) !== null;
    }
}