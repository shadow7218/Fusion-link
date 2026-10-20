/**
 * Local Storage Wrapper
 * Namespaced keys with JSON parse/stringify safely wrapped
 */

const PREFIX = 'lib_';

export const storage = {
    /**
     * Get an item from localStorage
     * @param {string} key 
     * @param {any} defaultValue 
     * @returns {any}
     */
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Storage get error for key "${key}":`, error);
            return defaultValue;
        }
    },

    /**
     * Set an item in localStorage
     * @param {string} key 
     * @param {any} value 
     */
    set: (key, value) => {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Storage set error for key "${key}":`, error);
        }
    },

    /**
     * Remove an item from localStorage
     * @param {string} key 
     */
    remove: (key) => {
        try {
            localStorage.removeItem(PREFIX + key);
        } catch (error) {
            console.warn(`Storage remove error for key "${key}":`, error);
        }
    }
};
