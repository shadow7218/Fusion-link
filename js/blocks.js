import { CONFIG } from './config.js';
import { storage } from './storage.js';
import { toast } from './modals.js';

/**
 * Injects block-specific CSS only once
 */
function injectBlockStyles() {
    if (document.getElementById('blocks-css')) return;
    const style = document.createElement('style');
    style.id = 'blocks-css';
    style.textContent = `
        /* Blocks Base */
        .glass-block { background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)); -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: var(--spacing-md); box-shadow: inset 0 1px 1px var(--glass-highlight), var(--glass-shadow); color: var(--text-primary); position: relative; overflow: hidden; }
        
        /* Greeting & Weather */
        .header-block { display: flex; justify-content: space-between; align-items: center; }
        .greeting-text { font-size: 1.1rem; font-weight: 600; }
        .time-text { font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px; }
        .weather-widget { display: flex; align-items: center; gap: 8px; font-weight: 600; }
        
        /* Announcement */
        .announcement-block { background: rgba(var(--accent-rgb, 128, 128, 128), 0.15); border: 1px solid rgba(var(--accent-rgb, 128, 128, 128), 0.3); display: flex; justify-content: space-between; align-items: center; color: var(--accent, inherit); }
        .announcement-close { background: none; border: none; color: inherit; cursor: pointer; padding: 4px; border-radius: 50%; display: flex; opacity: 0.7; }
        .announcement-close:hover { opacity: 1; background: rgba(255,255,255,0.2); }
        
        /* Countdown */
        .countdown-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center; margin-top: 12px; }
        .cd-val { font-size: 1.5rem; font-weight: 700; font-variant-numeric: tabular-nums; }
        .cd-lbl { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); }
        
        /* Music Player */
        .music-player { display: flex; align-items: center; gap: 12px; }
        .play-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--text-primary); color: var(--bg-base); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
        .progress-bar-bg { flex-grow: 1; height: 6px; background: rgba(128,128,128,0.2); border-radius: 3px; cursor: pointer; position: relative; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: var(--text-primary); width: 0%; pointer-events: none; transition: width 0.1s linear; }
        
        /* FAQ Accordion */
        .faq-item { border-bottom: 1px solid var(--glass-border); }
        .faq-item:last-child { border-bottom: none; }
        .faq-btn { width: 100%; text-align: left; padding: 12px 0; font-weight: 600; display: flex; justify-content: space-between; cursor: pointer; border: none; background: none; color: inherit; }
        .faq-content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; color: var(--text-secondary); font-size: 0.95rem; }
        .faq-content.open { max-height: 200px; padding-bottom: 12px; }
        .faq-icon { transition: transform 0.3s ease; }
        .faq-btn[aria-expanded="true"] .faq-icon { transform: rotate(180deg); }
        
        /* Counters */
        .counters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; text-align: center; }
        .counter-val { font-size: 1.8rem; font-weight: 700; font-variant-numeric: tabular-nums; }
        .counter-lbl { font-size: 0.8rem; color: var(--text-secondary); }
        
        /* Testimonials */
        .testi-carousel { position: relative; overflow: hidden; text-align: center; padding: 10px 0; }
        .testi-slide { display: none; animation: fade-in 0.4s ease; }
        .testi-slide.active { display: block; }
        .testi-text { font-style: italic; font-size: 0.95rem; margin-bottom: 8px; }
        .testi-author { font-weight: 600; font-size: 0.85rem; color: var(--accent); }
        .testi-dots { display: flex; justify-content: center; gap: 6px; margin-top: 12px; }
        .testi-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(128,128,128,0.3); }
        .testi-dot.active { background: var(--text-primary); }
        @keyframes fade-in { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        
        /* Forms */
        .sub-form { display: flex; gap: 8px; margin-top: 8px; }
        .glass-input { flex-grow: 1; background: rgba(0,0,0,0.05); border: 1px solid var(--glass-border); padding: 10px 12px; border-radius: var(--radius-sm); color: inherit; font-family: inherit; }
        @media(prefers-color-scheme: dark) { .glass-input { background: rgba(255,255,255,0.05); } }
    `;
    document.head.appendChild(style);
}

/**
 * Renders all blocks into the target container
 */
export function renderBlocks(container) {
    injectBlockStyles();
    container.innerHTML = '';
    
    const configName = storage.get('name', CONFIG.name);
    
    // 1. Greeting + Live Clock + Weather
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
        let greeting = 'Good evening';
        if (hr < 12) greeting = 'Good morning';
        else if (hr < 18) greeting = 'Good afternoon';
        
        timeInfo.querySelector('.greeting-text').textContent = `${greeting}, ${configName.split(' ')[0]}`;
        timeInfo.querySelector('.time-text').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    updateTime();
    setInterval(updateTime, 1000);
    
    if (CONFIG.weatherCity) {
        weatherWidget.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> <span>...</span>`;
        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(CONFIG.weatherCity)}&count=1`)
            .then(r => r.json())
            .then(geo => {
                if (!geo.results || !geo.results.length) throw new Error('Not found');
                return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geo.results[0].latitude}&longitude=${geo.results[0].longitude}&current_weather=true`);
            })
            .then(r => r.json())
            .then(data => {
                weatherWidget.querySelector('span').textContent = `${Math.round(data.current_weather.temperature)}°`;
            })
            .catch(() => weatherWidget.querySelector('span').textContent = '—');
    }
    
    // 2. Announcement Banner
    const announcementText = storage.get('announcement', CONFIG.announcement);
    if (announcementText) {
        const hash = btoa(encodeURIComponent(announcementText)).substring(0, 10);
        if (!storage.get(`dismissed_${hash}`)) {
            const ann = document.createElement('div');
            ann.className = 'glass-block announcement-block';
            ann.innerHTML = `
                <div>${announcementText}</div>
                <button class="announcement-close" aria-label="Dismiss">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            `;
            ann.querySelector('.announcement-close').onclick = () => {
                ann.style.display = 'none';
                storage.set(`dismissed_${hash}`, true);
            };
            container.appendChild(ann);
        }
    }
    
    // 3. Music Player (Vanilla Audio)
    if (CONFIG.music && !CONFIG.music.includes('embed')) {
        const musicBlock = document.createElement('div');
        musicBlock.className = 'glass-block';
        musicBlock.innerHTML = `
            <div style="font-size: 0.85rem; font-weight:600; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg> Currently Listening
            </div>
            <div class="music-player">
                <audio id="bg-audio" src="${CONFIG.music}" preload="none"></audio>
                <button class="play-btn" aria-label="Play/Pause">
                    <svg class="icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    <svg class="icon-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                </button>
                <div class="progress-bar-bg" id="audio-progress">
                    <div class="progress-bar-fill" id="audio-fill"></div>
                </div>
            </div>
        `;
        const audio = musicBlock.querySelector('#bg-audio');
        const playBtn = musicBlock.querySelector('.play-btn');
        const iconPlay = musicBlock.querySelector('.icon-play');
        const iconPause = musicBlock.querySelector('.icon-pause');
        const fill = musicBlock.querySelector('#audio-fill');
        const progressBg = musicBlock.querySelector('#audio-progress');
        
        playBtn.onclick = () => {
            if (audio.paused) { audio.play(); iconPlay.style.display = 'none'; iconPause.style.display = 'block'; } 
            else { audio.pause(); iconPlay.style.display = 'block'; iconPause.style.display = 'none'; }
        };
        audio.ontimeupdate = () => { fill.style.width = `${(audio.currentTime / audio.duration) * 100}%`; };
        progressBg.onclick = (e) => { audio.currentTime = (e.offsetX / progressBg.offsetWidth) * audio.duration; };
        
        container.appendChild(musicBlock);
    }
    
    // 4. Countdown Timer
    if (CONFIG.countdownDate) {
        const cdBlock = document.createElement('div');
        cdBlock.className = 'glass-block';
        cdBlock.innerHTML = `
            <div style="font-size: 0.85rem; font-weight:600; text-align:center;">Launch Countdown</div>
            <div class="countdown-grid">
                <div><div class="cd-val" id="cd-d">00</div><div class="cd-lbl">Days</div></div>
                <div><div class="cd-val" id="cd-h">00</div><div class="cd-lbl">Hrs</div></div>
                <div><div class="cd-val" id="cd-m">00</div><div class="cd-lbl">Min</div></div>
                <div><div class="cd-val" id="cd-s">00</div><div class="cd-lbl">Sec</div></div>
            </div>
        `;
        const target = new Date(CONFIG.countdownDate).getTime();
        const updateCd = () => {
            const now = new Date().getTime();
            const dist = target - now;
            if (dist < 0) return;
            cdBlock.querySelector('#cd-d').textContent = String(Math.floor(dist / (1000 * 60 * 60 * 24))).padStart(2, '0');
            cdBlock.querySelector('#cd-h').textContent = String(Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            cdBlock.querySelector('#cd-m').textContent = String(Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            cdBlock.querySelector('#cd-s').textContent = String(Math.floor((dist % (1000 * 60)) / 1000)).padStart(2, '0');
        };
        updateCd();
        setInterval(updateCd, 1000);
        container.appendChild(cdBlock);
    }
    
    // 5. Social Proof Counters (Mock data if none provided, to show UI)
    const counters = CONFIG.counters || [ { label: 'Projects Built', value: 42 }, { label: 'Coffee Cups', value: 890 } ];
    if (counters.length > 0) {
        const countBlock = document.createElement('div');
        countBlock.className = 'glass-block counters-grid';
        counters.forEach(c => {
            countBlock.innerHTML += `<div><div class="counter-val" data-target="${c.value}">0</div><div class="counter-lbl">${c.label}</div></div>`;
        });
        container.appendChild(countBlock);
        
        // Intersection Observer for Count Up
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'));
                    let current = 0;
                    const inc = Math.ceil(target / 40);
                    const timer = setInterval(() => {
                        current += inc;
                        if (current >= target) { el.textContent = target; clearInterval(timer); }
                        else { el.textContent = current; }
                    }, 40);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            countBlock.querySelectorAll('.counter-val').forEach(el => observer.observe(el));
        } else {
            countBlock.querySelectorAll('.counter-val').forEach(el => el.textContent = el.getAttribute('data-target'));
        }
    }
    
    // 6. Testimonials Carousel
    const testimonials = CONFIG.testimonials || [ { text: "The cleanest mobile UI I've seen. 10/10.", author: "Product Hunt" }, { text: "Lightning fast and beautiful.", author: "Design Weekly" } ];
    if (testimonials.length > 0) {
        const testiBlock = document.createElement('div');
        testiBlock.className = 'glass-block testi-carousel';
        let html = '';
        testimonials.forEach((t, i) => {
            html += `<div class="testi-slide ${i === 0 ? 'active' : ''}">
                <div class="testi-text">"${t.text}"</div>
                <div class="testi-author">— ${t.author}</div>
            </div>`;
        });
        html += `<div class="testi-dots">` + testimonials.map((_, i) => `<div class="testi-dot ${i === 0 ? 'active' : ''}"></div>`).join('') + `</div>`;
        testiBlock.innerHTML = html;
        
        let currentIdx = 0;
        const slides = testiBlock.querySelectorAll('.testi-slide');
        const dots = testiBlock.querySelectorAll('.testi-dot');
        
        const showSlide = (idx) => {
            slides[currentIdx].classList.remove('active');
            dots[currentIdx].classList.remove('active');
            currentIdx = idx;
            slides[currentIdx].classList.add('active');
            dots[currentIdx].classList.add('active');
        };
        
        setInterval(() => { showSlide((currentIdx + 1) % slides.length); }, 5000);
        container.appendChild(testiBlock);
    }
    
    // 7. FAQ Accordion
    const faqs = CONFIG.faqs || [ { q: "Are you available for freelance work?", a: "Yes, currently accepting new clients for Q4." }, { q: "What tech stack is this?", a: "Pure Vanilla HTML, CSS, and JS!" } ];
    if (faqs.length > 0) {
        const faqBlock = document.createElement('div');
        faqBlock.className = 'glass-block';
        faqBlock.innerHTML = `<div style="font-size: 1.05rem; font-weight:700; margin-bottom:12px;">FAQ</div>`;
        faqs.forEach((faq, i) => {
            const item = document.createElement('div');
            item.className = 'faq-item';
            item.innerHTML = `
                <button class="faq-btn" aria-expanded="false" aria-controls="faq-content-${i}">
                    <span>${faq.q}</span>
                    <svg class="faq-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faq-content" id="faq-content-${i}">
                    <div style="padding-top: 4px;">${faq.a}</div>
                </div>
            `;
            item.querySelector('.faq-btn').onclick = function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                const content = item.querySelector('.faq-content');
                if (!isExpanded) { content.classList.add('open'); }
                else { content.classList.remove('open'); }
            };
            faqBlock.appendChild(item);
        });
        container.appendChild(faqBlock);
    }
    
    // 8. Newsletter Subscribe & Tip
    const actionBlock = document.createElement('div');
    actionBlock.className = 'glass-block';
    actionBlock.innerHTML = `
        <div style="font-size: 0.95rem; font-weight:600;">Subscribe to Newsletter</div>
        <form class="sub-form" id="newsletter-form">
            <input type="email" class="glass-input" placeholder="Your email address" required>
            <button type="submit" class="glass-btn" style="width:auto; padding:8px 16px; font-size:0.9rem;">Join</button>
        </form>
        ${CONFIG.tipUrl ? `<a href="${CONFIG.tipUrl}" target="_blank" rel="noopener" class="glass-btn" style="margin-top:var(--spacing-md); background:var(--accent); color:#fff; border-color:transparent;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Support My Work</a>` : ''}
    `;
    actionBlock.querySelector('#newsletter-form').onsubmit = (e) => {
        e.preventDefault();
        e.target.reset();
        toast('Thanks for subscribing!');
    };
    container.appendChild(actionBlock);
                                                                                                                                      }
