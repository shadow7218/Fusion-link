import { CONFIG } from './config.js';
import { storage } from './storage.js';
import { getIcon } from './icons.js';
import { generateQR, downloadQRPng } from './qr.js';

/* ==========================================================================
   Base Modal & Toast System
   ========================================================================== */

const modalRoot = document.getElementById('modal-root');
const toastContainer = document.getElementById('toast-container');
let activeModals = [];

// Inject structural CSS for modals & toasts (glass styles exist in glass.css)
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100; display: flex; align-items: flex-end; justify-content: center; opacity: 0; transition: opacity 0.3s ease; padding: 16px; }
    .modal-overlay.active { opacity: 1; }
    @media(min-width: 768px) { .modal-overlay { align-items: center; } }
    .modal-content { width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); border-radius: var(--radius-lg); padding: var(--spacing-lg); position: relative; }
    @media(min-width: 768px) { .modal-content { transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); } }
    .modal-overlay.active .modal-content { transform: translateY(0) scale(1); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md); }
    .modal-close { background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: inherit; }
    
    #toast-container { position: fixed; top: env(safe-area-inset-top, 20px); left: 50%; transform: translateX(-50%); z-index: 200; display: flex; flex-direction: column; gap: 8px; align-items: center; pointer-events: none; }
    .toast-anim { animation: toast-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes toast-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(modalStyles);

export function toast(msg) {
    const el = document.createElement('div');
    el.className = 'glass-toast toast-anim';
    el.textContent = msg;
    toastContainer.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s';
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

export function openModal({ title, content, onOpen, onClose }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('role', 'dialog');
    
    const modal = document.createElement('div');
    modal.className = 'modal-content glass-modal';
    
    modal.innerHTML = `
        <div class="modal-header">
            <h2 style="font-size: 1.25rem; font-weight: 600;">${title}</h2>
            <button class="modal-close" aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
        </div>
        <div class="modal-body">${content}</div>
    `;
    
    overlay.appendChild(modal);
    modalRoot.appendChild(overlay);
    
    const closeBtn = modal.querySelector('.modal-close');
    
    const close = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            overlay.remove();
            activeModals = activeModals.filter(m => m !== close);
            if(onClose) onClose();
        }, 400);
    };
    
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if(e.target === overlay) close(); });
    
    // Focus Trap
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
    
    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
        if (e.key === 'Tab' && focusable.length) {
            const first = focusable[0], last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    
    // Animate in
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlay.classList.add('active'));
    activeModals.push(close);
    if(onOpen) setTimeout(() => onOpen(modal), 10);
}

export function closeAll() {
    activeModals.forEach(close => close());
}

/* ==========================================================================
   Feature Functions
   ========================================================================== */

export function copyPageLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => toast('Link copied!'))
        .catch(() => toast('Failed to copy'));
}

export function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: storage.get('name', CONFIG.name),
            text: storage.get('bio', CONFIG.bio),
            url: window.location.href
        }).catch(() => copyPageLink());
    } else {
        copyPageLink();
    }
}

export function openQR() {
    const url = window.location.href;
    const svgQr = generateQR(url, 200);
    
    openModal({
        title: 'QR Code',
        content: `
            <div style="display:flex; flex-direction:column; align-items:center; gap:var(--spacing-md); background:#fff; padding:var(--spacing-lg); border-radius:var(--radius-md);">
                ${svgQr}
            </div>
            <button id="download-qr-btn" class="glass-btn" style="margin-top:var(--spacing-md); background:var(--accent);">Download PNG</button>
        `,
        onOpen: (modal) => {
            modal.querySelector('#download-qr-btn').addEventListener('click', () => {
                downloadQRPng(url, 1000);
                toast('QR Code downloaded');
            });
        }
    });
}

export function downloadVCard() {
    const n = storage.get('name', CONFIG.name);
    const b = storage.get('bio', CONFIG.bio);
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;${n};;;\nFN:${n}\nNOTE:${b}\nEMAIL:${CONFIG.contactEmail}\nURL:${window.location.href}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact.vcf';
    a.click();
    URL.revokeObjectURL(url);
    toast('vCard saved');
}

export function openGallery() {
    const images = CONFIG.gallery;
    if (!images || !images.length) return toast('No images in gallery');
    
    let current = 0;
    openModal({
        title: 'Gallery',
        content: `
            <div style="position:relative; width:100%; aspect-ratio:1; border-radius:var(--radius-sm); overflow:hidden;">
                <img id="gal-img" src="${images[current]}" style="width:100%; height:100%; object-fit:cover; transition: opacity 0.3s;" />
                <div style="position:absolute; inset:0; display:flex; justify-content:space-between; align-items:center; padding:10px;">
                    <button id="gal-prev" style="background:rgba(0,0,0,0.5); color:#fff; border:none; border-radius:50%; width:40px; height:40px; cursor:pointer;">&lt;</button>
                    <button id="gal-next" style="background:rgba(0,0,0,0.5); color:#fff; border:none; border-radius:50%; width:40px; height:40px; cursor:pointer;">&gt;</button>
                </div>
            </div>
            <div id="gal-counter" style="text-align:center; margin-top:10px;">1 / ${images.length}</div>
        `,
        onOpen: (modal) => {
            const imgEl = modal.querySelector('#gal-img');
            const counter = modal.querySelector('#gal-counter');
            
            const update = () => {
                imgEl.style.opacity = '0';
                setTimeout(() => {
                    imgEl.src = images[current];
                    imgEl.style.opacity = '1';
                    counter.textContent = `${current + 1} / ${images.length}`;
                }, 200);
            };
            
            modal.querySelector('#gal-prev').onclick = () => { current = (current - 1 + images.length) % images.length; update(); };
            modal.querySelector('#gal-next').onclick = () => { current = (current + 1) % images.length; update(); };
            
            // Swipe
            let startX = 0;
            imgEl.addEventListener('touchstart', e => startX = e.touches[0].clientX);
            imgEl.addEventListener('touchend', e => {
                const diff = startX - e.changedTouches[0].clientX;
                if (diff > 50) { current = (current + 1) % images.length; update(); }
                if (diff < -50) { current = (current - 1 + images.length) % images.length; update(); }
            });
        }
    });
}

export function openVideo() {
    if (!CONFIG.video) return toast('No video configured');
    openModal({
        title: 'Video',
        content: `
            <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:var(--radius-sm);">
                <iframe src="${CONFIG.video}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe>
            </div>
        `
    });
}

export function openContact() {
    openModal({
        title: 'Contact',
        content: `
            <form id="contact-form" style="display:flex; flex-direction:column; gap:var(--spacing-md);">
                <input type="text" placeholder="Name" required style="padding:12px; border-radius:var(--radius-sm); border:1px solid var(--glass-border); background:var(--glass-bg); color:inherit;">
                <textarea placeholder="Message" required rows="4" style="padding:12px; border-radius:var(--radius-sm); border:1px solid var(--glass-border); background:var(--glass-bg); color:inherit; font-family:inherit;"></textarea>
                <button type="submit" class="glass-btn" style="background:var(--accent); color:#fff;">Send Message</button>
            </form>
        `,
        onOpen: (modal) => {
            modal.querySelector('#contact-form').onsubmit = (e) => {
                e.preventDefault();
                window.location.href = `mailto:${CONFIG.contactEmail}?subject=Contact from Link-in-Bio`;
                toast('Opening mail client...');
                closeAll();
            };
        }
    });
}
