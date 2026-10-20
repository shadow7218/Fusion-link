import { storage } from './storage.js';
import { CONFIG } from './config.js';

export const THEMES = [
    { key: 'aurora', name: 'Aurora' },
    { key: 'midnight', name: 'Midnight' },
    { key: 'sunset', name: 'Sunset' },
    { key: 'ocean', name: 'Ocean' },
    { key: 'candy', name: 'Candy' },
    { key: 'mono', name: 'Monochrome' }
];

const MODES = ['auto', 'light', 'dark'];

/**
 * Applies a specific theme
 * @param {string} themeKey 
 */
export function applyTheme(themeKey) {
    // Fallback to default if invalid key
    if (!THEMES.find(t => t.key === themeKey)) {
        themeKey = THEMES[0].key;
    }
    
    document.documentElement.setAttribute('data-theme', themeKey);
    storage.set('theme', themeKey);
}

/**
 * Applies a color mode (light, dark, auto)
 * @param {string} mode 
 */
export function applyMode(mode) {
    if (!MODES.includes(mode)) {
        mode = 'auto';
    }

    if (mode === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-mode', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-mode', mode);
    }
    
    storage.set('mode', mode);
}

/**
 * Cycles to the next theme in the array
 * @returns {string} The new theme key
 */
export function cycleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || THEMES[0].key;
    const currentIndex = THEMES.findIndex(t => t.key === currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    
    applyTheme(THEMES[nextIndex].key);
    return THEMES[nextIndex].key;
}

/**
 * Toggles between light and dark modes (bypasses auto after explicit click)
 * @returns {string} The new mode
 */
export function toggleMode() {
    const currentMode = document.documentElement.getAttribute('data-mode') || 'light';
    const nextMode = currentMode === 'dark' ? 'light' : 'dark';
    
    applyMode(nextMode);
    // Overwrite the 'auto' preference since the user made an explicit choice
    storage.set('mode', nextMode); 
    
    return nextMode;
}

/**
 * Initialize themes and modes on app load
 */
export function initTheming() {
    // 1. Get from storage, fallback to config
    const savedTheme = storage.get('theme', CONFIG.theme);
    const savedMode = storage.get('mode', CONFIG.mode);
    
    applyTheme(savedTheme);
    applyMode(savedMode);

    // 2. Listen for system preference changes if in auto mode
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const currentStoredMode = storage.get('mode', CONFIG.mode);
        if (currentStoredMode === 'auto') {
            document.documentElement.setAttribute('data-mode', e.matches ? 'dark' : 'light');
        }
    });
}
