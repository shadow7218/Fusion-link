import { CONFIG } from './config.js';
import { storage } from './storage.js';
import { toast, openModal, closeAll } from './modals.js';
import { THEMES, applyTheme, applyMode } from './themes.js';
import { ICONS } from './icons.js';

const drawerRoot = document.getElementById('drawer-root');

// Inject Drawer Styles
const style = document.createElement('style');
style.textContent = `
    .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 400; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
    .drawer-overlay.active { opacity: 1; pointer-events: auto; }
    .settings-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 420px; background: var(--glass-bg); backdrop-filter: blur(calc(var(--glass-blur) + 10px)) saturate(var(--glass-saturate)); -webkit-backdrop-filter: blur(calc(var(--glass-blur) + 10px)) saturate(var(--glass-saturate)); border-left: 1px solid var(--glass-border); z-index: 401; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.1); }
    .settings-drawer.active { transform: translateX(0); }
    .drawer-header { padding: 20px; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.05); }
    .drawer-content { flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 24px; }
    .drawer-footer { padding: 16px 20px; border-top: 1px solid var(--glass-border); display: flex; gap: 12px; background: rgba(0,0,0,0.05); }
    
    .setting-group { display: flex; flex-direction: column; gap: 8px; }
    .setting-label { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); }
    .setting-input { background: rgba(0,0,0,0.05); border: 1px solid var(--glass-border); padding: 12px; border-radius: var(--radius-sm); color: var(--text-primary); font-family: inherit; width: 100%; }
    @media(prefers-color-scheme: dark) { .setting-input { background: rgba(255,255,255,0.05); } }
    
    .theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .theme-btn { padding: 12px; border-radius: var(--radius-sm); border: 2px solid transparent; background: var(--glass-bg); cursor: pointer; text-align: center; font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }
    .theme-btn.active { border-color: var(--accent); }
    
    .link-edit-card { background: rgba(128,128,128,0.1); border: 1px solid var(--glass-border); border-radius: var(--radius-sm); padding: 12px; display: flex; gap: 12px; position: relative; margin-bottom: 12px; transition: transform 0.2s, box-shadow 0.2s; }
    .link-edit-card.dragging { opacity: 0.8; transform: scale(1.02); box-shadow: var(--glass-shadow); z-index: 10; }
    .drag-handle { cursor: grab; padding: 10px 5px; display: flex; align-items: center; color: var(--text-secondary); touch-action: none; }
    .link-fields { flex-grow: 1; display: flex; flex-direction: column; gap: 8px; }
    .link-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
`;
document.head.appendChild(style);

let drawerEl = null;
let overlayEl = null;

export function openSettings() {
    if (drawerEl) return;
    
    overlayEl = document.createElement('div');
    overlayEl.className = 'drawer-overlay';
    
    drawerEl = document.createElement('div');
    drawerEl.className = 'settings-drawer';
    
    const linksData = storage.get('links', CONFIG.links).map(l => ({ ...l, id: l.id || Date.now() + Math.random() }));
    
    drawerEl.innerHTML = `
        <div class="drawer-header">
            <h2 style="font-size:1.2rem; font-weight:700;">Settings</h2>
            <button class="close-drawer" style="background:none; border:none; color:inherit; cursor:pointer; padding:4px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
        </div>
        <div class="drawer-content">
            <!-- Profile -->
            <div class="setting-group">
                <div class="setting-label">Profile</div>
                <input type="text" id="set-name" class="setting-input" placeholder="Name" value="${storage.get('name', CONFIG.name)}">
                <textarea id="set-bio" class="setting-input" placeholder="Bio" rows="3">${storage.get('bio', CONFIG.bio)}</textarea>
                <input type="url" id="set-avatar" class="setting-input" placeholder="Avatar URL" value="${storage.get('avatar', CONFIG.avatar)}">
            </div>
            
            <!-- Blocks -->
            <div class="setting-group">
                <div class="setting-label">Blocks & Features</div>
                <input type="text" id="set-ann" class="setting-input" placeholder="Announcement Banner" value="${storage.get('announcement', CONFIG.announcement)}">
                <input type="url" id="set-music" class="setting-input" placeholder="Music URL (Audio file)" value="${storage.get('music', CONFIG.music)}">
                <input type="url" id="set-video" class="setting-input" placeholder="Video Embed URL" value="${storage.get('video', CONFIG.video)}">
                <input type="text" id="set-weather" class="setting-input" placeholder="Weather City" value="${storage.get('weatherCity', CONFIG.weatherCity)}">
                <input type="datetime-local" id="set-countdown" class="setting-input" value="${storage.get('countdownDate', CONFIG.countdownDate).slice(0,16)}">
            </div>

            <!-- Appearance -->
            <div class="setting-group">
                <div class="setting-label">Appearance</div>
                <select id="set-mode" class="setting-input">
                    <option value="auto" ${storage.get('mode', CONFIG.mode) === 'auto' ? 'selected' : ''}>Auto Mode</option>
                    <option value="light" ${storage.get('mode', CONFIG.mode) === 'light' ? 'selected' : ''}>Light Mode</option>
                    <option value="dark" ${storage.get('mode', CONFIG.mode) === 'dark' ? 'selected' : ''}>Dark Mode</option>
                </select>
                <div class="theme-grid" id="theme-grid"></div>
            </div>

            <!-- Links -->
            <div class="setting-group">
                <div class="setting-label">Links (Drag ≡ to reorder)</div>
                <div id="links-editor-list"></div>
                <button id="add-link-btn" class="glass-btn" style="margin-top:8px;">+ Add New Link</button>
            </div>

            <!-- Data -->
            <div class="setting-group" style="margin-top: 16px;">
                <div class="setting-label">Data Management</div>
                <div style="display:flex; gap:8px;">
                    <button id="export-btn" class="glass-btn" style="flex:1;">Export</button>
                    <button id="import-btn-proxy" class="glass-btn" style="flex:1;">Import</button>
                    <input type="file" id="import-file" accept=".json" style="display:none;">
                </div>
                <button id="reset-btn" class="glass-btn" style="border-color:#ff4757; color:#ff4757; margin-top:8px;">Reset to Defaults</button>
            </div>
        </div>
        <div class="drawer-footer">
            <button id="cancel-btn" class="glass-btn" style="flex:1; background:rgba(128,128,128,0.1);">Cancel</button>
            <button id="save-btn" class="glass-btn" style="flex:2; background:var(--accent); color:#fff; border:none;">Save & Apply</button>
        </div>
    `;
    
    drawerRoot.appendChild(overlayEl);
    drawerRoot.appendChild(drawerEl);
    
    // Render Themes
    const themeGrid = drawerEl.querySelector('#theme-grid');
    const currentTheme = storage.get('theme', CONFIG.theme);
    THEMES.forEach(t => {
        const btn = document.createElement('button');
        btn.className = `theme-btn ${t.key === currentTheme ? 'active' : ''}`;
        btn.textContent = t.name;
        btn.onclick = () => {
            applyTheme(t.key); // Live apply
            themeGrid.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
        themeGrid.appendChild(btn);
    });
    
    // Render Links
    const linksContainer = drawerEl.querySelector('#links-editor-list');
    const platformOptions = Object.keys(ICONS).map(k => `<option value="${k}">${k.charAt(0).toUpperCase() + k.slice(1)}</option>`).join('');
    
    const renderLinkEditor = (link) => {
        const el = document.createElement('div');
        el.className = 'link-edit-card';
        el.dataset.id = link.id;
        el.innerHTML = `
            <div class="drag-handle" title="Drag to reorder"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></svg></div>
            <div class="link-fields">
                <select class="setting-input plat-sel" style="padding:8px;">
                    ${platformOptions.replace(`value="${link.platform.toLowerCase()}"`, `value="${link.platform.toLowerCase()}" selected`)}
                </select>
                <input type="text" class="setting-input lbl-in" placeholder="Label" value="${link.label}" style="padding:8px;">
                <input type="text" class="setting-input sub-in" placeholder="Subtitle (Optional)" value="${link.subtitle || ''}" style="padding:8px;">
                <input type="url" class="setting-input url-in" placeholder="URL" value="${link.url}" style="padding:8px;">
                <div class="link-actions">
                    <label style="font-size:0.8rem; display:flex; align-items:center; gap:4px;"><input type="checkbox" class="en-chk" ${link.enabled ? 'checked' : ''}> Enabled</label>
                    <label style="font-size:0.8rem; display:flex; align-items:center; gap:4px;"><input type="checkbox" class="feat-chk" ${link.featured ? 'checked' : ''}> Featured</label>
                    <button class="del-link" style="background:none; border:none; color:#ff4757; cursor:pointer;" aria-label="Delete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                </div>
            </div>
        `;
        el.querySelector('.del-link').onclick = () => el.remove();
        return el;
    };
    
    linksData.forEach(l => linksContainer.appendChild(renderLinkEditor(l)));
    
    drawerEl.querySelector('#add-link-btn').onclick = () => {
        linksContainer.appendChild(renderLinkEditor({ id: Date.now(), platform: 'custom', label: 'New Link', url: 'https://', featured: false, enabled: true }));
    };
    
    // Drag to Reorder Logic (Touch + Mouse)
    let dragged = null;
    
    linksContainer.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('.drag-handle')) return;
        dragged = e.target.closest('.link-edit-card');
        dragged.classList.add('dragging');
        document.body.style.userSelect = 'none'; // Prevent text selection
    });
    
    window.addEventListener('pointermove', (e) => {
        if (!dragged) return;
        const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.link-edit-card');
        if (target && target !== dragged && target.parentNode === linksContainer) {
            const rect = target.getBoundingClientRect();
            const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
            linksContainer.insertBefore(dragged, next ? target.nextSibling : target);
        }
    });
    
    window.addEventListener('pointerup', () => {
        if (!dragged) return;
        dragged.classList.remove('dragging');
        dragged = null;
        document.body.style.userSelect = '';
    });

    // Save & Close logic
    const closeDrawer = () => {
        drawerEl.classList.remove('active');
        overlayEl.classList.remove('active');
        setTimeout(() => {
            drawerEl?.remove();
            overlayEl?.remove();
            drawerEl = null;
        }, 400);
    };

    drawerEl.querySelector('.close-drawer').onclick = closeDrawer;
    drawerEl.querySelector('#cancel-btn').onclick = closeDrawer;
    overlayEl.onclick = closeDrawer;
    
    // Mode toggle preview
    drawerEl.querySelector('#set-mode').onchange = (e) => applyMode(e.target.value);
    
    // Save Action
    drawerEl.querySelector('#save-btn').onclick = () => {
        // Collect basic settings
        storage.set('name', drawerEl.querySelector('#set-name').value);
        storage.set('bio', drawerEl.querySelector('#set-bio').value);
        storage.set('avatar', drawerEl.querySelector('#set-avatar').value);
        storage.set('announcement', drawerEl.querySelector('#set-ann').value);
        storage.set('music', drawerEl.querySelector('#set-music').value);
        storage.set('video', drawerEl.querySelector('#set-video').value);
        storage.set('weatherCity', drawerEl.querySelector('#set-weather').value);
        
        let cd = drawerEl.querySelector('#set-countdown').value;
        storage.set('countdownDate', cd ? new Date(cd).toISOString() : '');
        
        const mode = drawerEl.querySelector('#set-mode').value;
        storage.set('mode', mode);
        applyMode(mode);
        
        // Collect links preserving DOM order
        const linkEls = linksContainer.querySelectorAll('.link-edit-card');
        const newLinks = Array.from(linkEls).map(el => ({
            id: el.dataset.id,
            platform: el.querySelector('.plat-sel').value,
            label: el.querySelector('.lbl-in').value,
            subtitle: el.querySelector('.sub-in').value,
            url: el.querySelector('.url-in').value,
            featured: el.querySelector('.feat-chk').checked,
            enabled: el.querySelector('.en-chk').checked
        }));
        storage.set('links', newLinks);
        
        // Dispatch global update event so app.js can re-render
        window.dispatchEvent(new Event('lib-update'));
        
        toast('Settings saved globally!');
        closeDrawer();
    };

    // Import / Export / Reset
    drawerEl.querySelector('#export-btn').onclick = () => {
        const data = {
            name: storage.get('name', CONFIG.name),
            bio: storage.get('bio', CONFIG.bio),
            avatar: storage.get('avatar', CONFIG.avatar),
            theme: storage.get('theme', CONFIG.theme),
            mode: storage.get('mode', CONFIG.mode),
            links: storage.get('links', CONFIG.links),
            announcement: storage.get('announcement', CONFIG.announcement),
            music: storage.get('music', CONFIG.music),
            video: storage.get('video', CONFIG.video),
            weatherCity: storage.get('weatherCity', CONFIG.weatherCity),
            countdownDate: storage.get('countdownDate', CONFIG.countdownDate)
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'linkinbio-config.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    drawerEl.querySelector('#import-btn-proxy').onclick = () => drawerEl.querySelector('#import-file').click();
    drawerEl.querySelector('#import-file').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                Object.keys(json).forEach(k => storage.set(k, json[k]));
                window.dispatchEvent(new Event('lib-update'));
                toast('Config imported!');
                closeDrawer();
            } catch (err) {
                toast('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    drawerEl.querySelector('#reset-btn').onclick = () => {
        if(confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
            localStorage.clear(); // Clears all local storage including namespaced keys
            window.dispatchEvent(new Event('lib-update'));
            toast('Reset to defaults');
            closeDrawer();
        }
    };

    // Animate In
    requestAnimationFrame(() => {
        overlayEl.classList.add('active');
        drawerEl.classList.add('active');
    });
          }
