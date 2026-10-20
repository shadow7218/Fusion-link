import { CONFIG } from './config.js';
import { storage } from './storage.js';
import { initTheming, cycleTheme, toggleMode } from './themes.js';
import { getIcon, ICONS } from './icons.js';
import { sharePage, openQR, closeAll } from './modals.js';
import { renderBlocks } from './blocks.js';
import { openSettings } from './settings.js';

// DOM Elements
const profileName = document.getElementById('profile-name');
const profileBio = document.getElementById('profile-bio');
const profileAvatar = document.getElementById('profile-avatar');
const blocksList = document.getElementById('blocks-list');
const linksList = document.getElementById('links-list');

// Floating Buttons
const btnTheme = document.getElementById('btn-theme');
const btnMode = document.getElementById('btn-mode');
const btnShare = document.getElementById('btn-share');
const btnQr = document.getElementById('btn-qr');
const btnSettings = document.getElementById('btn-settings');

/**
 * Renders the header profile data
 */
function renderProfile() {
    profileName.textContent = storage.get('name', CONFIG.name);
    profileBio.textContent = storage.get('bio', CONFIG.bio);
    
    const avatarUrl = storage.get('avatar', CONFIG.avatar);
    if (avatarUrl) {
        profileAvatar.src = avatarUrl;
        profileAvatar.style.display = 'block';
    } else {
        profileAvatar.style.display = 'none';
    }
}

/**
 * Attaches a material-like ripple effect to elements
 */
function createRipple(event) {
    const button = event.currentTarget;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.querySelector('.ripple');
    if (ripple) ripple.remove();

    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
}

/**
 * Render the main links list
 */
function renderLinks() {
    linksList.innerHTML = '';
    const activeLinks = storage.get('links', CONFIG.links);
    
    activeLinks.filter(link => link.enabled).forEach(link => {
        const linkEl = document.createElement('a');
        linkEl.href = link.url;
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';
        linkEl.className = 'glass-btn link-card';
        if (link.featured) linkEl.classList.add('featured');

        linkEl.innerHTML = `
            <div class="link-icon-wrapper">${getIcon(link.platform)}</div>
            <div class="link-content">
                <span class="link-title">${link.label}</span>
                ${link.subtitle ? `<span class="link-subtitle">${link.subtitle}</span>` : ''}
            </div>
        `;

        linkEl.addEventListener('mousedown', createRipple);
        linkEl.addEventListener('touchstart', (e) => {
            if(e.touches.length > 0) {
                const touch = e.touches[0];
                createRipple({ currentTarget: linkEl, clientX: touch.clientX, clientY: touch.clientY });
            }
        }, { passive: true });

        linksList.appendChild(linkEl);
    });
}

/**
 * Setup Floating Action Buttons
 */
function setupFABs() {
    btnTheme.innerHTML = ICONS.theme;
    btnMode.innerHTML = ICONS.mode;
    btnShare.innerHTML = ICONS.share;
    btnQr.innerHTML = ICONS.qr;
    btnSettings.innerHTML = ICONS.settings;

    btnTheme.addEventListener('click', cycleTheme);
    btnMode.addEventListener('click', toggleMode);
    btnShare.addEventListener('click', sharePage);
    btnQr.addEventListener('click', openQR);
    btnSettings.addEventListener('click', openSettings);
}

/**
 * Global Keyboard Shortcuts for Desktop
 */
function setupShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch (e.key.toLowerCase()) {
            case 't': cycleTheme(); break;
            case 'd': toggleMode(); break;
            case 's': sharePage(); break;
            case 'q': openQR(); break;
            case 'escape': closeAll(); break;
        }
    });
}

/**
 * Re-render hook for when settings change
 */
window.addEventListener('lib-update', () => {
    initTheming();
    renderProfile();
    renderBlocks(blocksList);
    renderLinks();
});

/**
 * Boot up the app
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheming();
    renderProfile();
    renderBlocks(blocksList);
    renderLinks();
    setupFABs();
    setupShortcuts();
    
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(err => console.warn('Service Worker failed', err));
    }
    
    // Handle PWA shortcut actions from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    if (action) {
        // Clean URL to prevent re-triggering on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => {
            if (action === 'share') sharePage();
            if (action === 'qr') openQR();
            if (action === 'settings') openSettings();
        }, 500); // Small delay to let animations finish
    }
});
