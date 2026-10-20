import { CONFIG } from './config.js';
import { storage } from './storage.js';
import { toast } from './modals.js';

function injectBlockStyles() {
    if (document.getElementById('blocks-css')) return;
    const style = document.createElement('style');
    style.id = 'blocks-css';
    style.textContent = `
        .glass-block { background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)); -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: var(--spacing-md); box-shadow: inset 0 1px 1px var(--glass-highlight), var(--glass-shadow); color: var(--text-primary); position: relative; overflow: hidden; }
        .header-block { display: flex; justify-content: space-between; align-items: center; }
        .greeting-text { font-size: 1.1rem; font-weight: 600; }
        .time-text { font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px; }
        .weather-widget { display: flex; align-items: center; gap: 8px; font-weight: 600; }
        .faq-item { border-bottom: 1px solid var(--glass-border); }
        .faq-item:last-child { border-bottom: none; }
        .faq-btn { width: 100%; text-align: left; padding: 12px 0; font-weight: 600; display: flex; justify-content: space-between; cursor: pointer; border: none; background: none; color: inherit; }
        .faq-content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; color: var(--text-secondary); font-size: 0.95rem; }
        .faq-content.open { max-height: 200px; padding-bottom: 12px; }
        .faq-icon { transition: transform 0.3s ease; }
        .faq-btn[aria-expanded="true"] .faq-icon { transform: rotate(180deg); }
    `;
    document.head.appendChild(style);
}

export function renderBlocks(container) {
    injectBlockStyles();
    container.innerHTML = '';
    const configName = storage.get('name', CONFIG.name);
    
    // 1. Header (Clock/Weather)
    const headerBlock = document.createElement('div');
    headerBlock.className = 'glass-block header-block';
    const timeInfo = document.createElement('div');
    timeInfo.innerHTML = `<div class="greeting-text"></div><div class="time-text"></div>`;
    headerBlock.appendChild(timeInfo);
    const weatherWidget = document.createElement('div');
    weatherWidget.className = 'weather-widget';
    headerBlock.appendChild(weatherWidget);
    container.appendChild(headerBlock);
    
    const updateTime = () => {
        const now = new Date();
        const hr = now.getHours();
        let greeting = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
        timeInfo.querySelector('.greeting-text').textContent = `${greeting}, ${configName.split(' ')[0]}`;
        timeInfo.querySelector('.time-text').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    updateTime();
    // Clear old interval if exists to prevent memory leaks
    if (window._clockInterval) clearInterval(window._clockInterval);
    window._clockInterval = setInterval(updateTime, 1000);
    
    if (CONFIG.weatherCity) {
        weatherWidget.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> <span>...</span>`;
        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(CONFIG.weatherCity)}&count=1`)
            .then(r => r.json())
            .then(geo => fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geo.results[0].latitude}&longitude=${geo.results[0].longitude}&current_weather=true`))
            .then(r => r.json())
            .then(data => weatherWidget.querySelector('span').textContent = `${Math.round(data.current_weather.temperature)}°`)
            .catch(() => weatherWidget.querySelector('span').textContent = '—');
    }
    
    // 2. Spotify Widget
    if (CONFIG.spotifyPlaylist) {
        const spotifyBlock = document.createElement('div');
        spotifyBlock.className = 'glass-block block-spotify';
        spotifyBlock.innerHTML = `
            <div style="font-size: 0.9rem; font-weight:600; display:flex; align-items:center; gap:6px; margin-bottom: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.8-9.3-1-1.1.3-2.2.7-3.1 1.2-.3.2-.7.1-.9-.2-.2-.3-.1-.7.2-.9 1-.6 2.3-1 3.6-1.4 4-.9 7.6-.5 10.3 1.1.4.2.5.7.3 1zm1.5-3.3c-.3.4-.8.5-1.2.3-3-1.8-7.5-2.4-11-1.3-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 4-1.2 9.1-.6 12.5 1.5.3.2.4.7.2 1zm.1-3.4C15.5 8.5 9.4 8.2 5.9 9.2c-.5.2-1-.2-1.1-.6-.2-.5.2-1 .6-1.1 4.1-1.2 11-1 15.3 1.5.4.2.6.8.3 1.2-.2.4-.8.6-1.2.3z"/></svg>
                Playlist
            </div>
            <iframe src="${CONFIG.spotifyPlaylist}" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        `;
        container.appendChild(spotifyBlock);
    }
    
    // 3. FAQ Accordion
    const faqs = CONFIG.faqs || [ { q: "Can I use these wallpapers for my phone?", a: "Yes! All wallpapers are free for personal use." }, { q: "Are you available for commissions?", a: "Yes, currently accepting new projects. DM me on Instagram." } ];
    if (faqs.length > 0) {
        const faqBlock = document.createElement('div');
        faqBlock.className = 'glass-block';
        faqBlock.innerHTML = `<div style="font-size: 1.05rem; font-weight:700; margin-bottom:12px;">FAQ</div>`;
        faqs.forEach((faq, i) => {
            const item = document.createElement('div');
            item.className = 'faq-item';
            item.innerHTML = `
                <button class="faq-btn" aria-expanded="false">
                    <span>${faq.q}</span>
                    <svg class="faq-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faq-content">
                    <div style="padding-top: 4px;">${faq.a}</div>
                </div>
            `;
            item.querySelector('.faq-btn').onclick = function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                item.querySelector('.faq-content').classList.toggle('open');
            };
            faqBlock.appendChild(item);
        });
        container.appendChild(faqBlock);
    }
    
    // 4. Support/Tip
    if (CONFIG.tipUrl) {
         const actionBlock = document.createElement('div');
         actionBlock.className = 'glass-block';
         actionBlock.innerHTML = `
            <a href="${CONFIG.tipUrl}" target="_blank" rel="noopener" class="glass-btn" style="background:var(--accent); color:#000; border-color:transparent; font-weight:700;">Support My Work</a>
         `;
         container.appendChild(actionBlock);
    }
}
