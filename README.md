# 📱 Liquid Glass Link in Bio

A multi-functional, 100% static, vanilla JS "Link in Bio" web application. It packs real functionality (media, QR, contact card, settings, dynamic blocks, PWA) into a single installable web app with a premium iOS-inspired "Liquid Glass" UI. 

No frameworks. No build steps. No server.

## ✨ Features
- **iOS Liquid Glass UI:** Beautiful backdrop filters, dynamic mesh gradients, and spring animations.
- **Fully Editable In-App:** A built-in settings drawer allows you to edit links, bio, and themes live.
- **Progressive Web App (PWA):** Installable to your phone's home screen. Works offline.
- **Zero Dependencies:** Pure HTML, CSS, and Vanilla JavaScript.
- **Functional Blocks:** Live weather, countdown timer, music player, FAQ accordion, testimonials, and live clock.
- **Built-in Tools:** QR code generator, native share API, vCard download, and config import/export.

## 📂 File Structure
\`\`\`text
/
├── index.html            # Main HTML skeleton
├── manifest.json         # PWA Manifest
├── service-worker.js     # Offline caching
├── README.md             # This file
├── css/
│   ├── base.css          # CSS Variables, resets, typography
│   ├── glass.css         # Liquid Glass design system
│   ├── themes.css        # Color schemes and mesh gradients
│   └── links.css         # Link card styling and ripples
└── js/
    ├── config.js         # Default data (Name, links, etc.)
    ├── app.js            # Main entry point and initialization
    ├── blocks.js         # Extra functional widgets
    ├── icons.js          # SVG icon library
    ├── modals.js         # Glass modal system and features
    ├── qr.js             # Pure JS QR Code generator
    ├── settings.js       # In-app editor and drag-and-drop
    ├── storage.js        # LocalStorage wrapper
    └── themes.js         # Theme switching logic
\`\`\`

## 🛠️ How to Edit Your Data

You have two ways to edit this app:

### 1. The Easy Way (In-App Editor)
1. Open the app in your browser.
2. Click the **Gear Icon** at the bottom right.
3. Edit your name, bio, links, and blocks.
4. Drag and drop links to reorder them.
5. Click **Save & Apply**. Changes are saved instantly to your browser's local storage.
6. *Tip:* Use the **Export** button in the settings drawer to download your configuration as a `.json` file for safekeeping.

### 2. The Developer Way (Code)
Open `js/config.js` in a text editor. This is the default blueprint. If a user visits your app for the first time, this is what they see. Edit the `CONFIG` object with your details, save, and deploy.

## 🚀 How to Deploy

Because this app is 100% static HTML/CSS/JS, you can host it anywhere for free.

### GitHub Pages (Recommended)
1. Upload/Push all files to a new GitHub repository.
2. Go to the repository **Settings** -> **Pages**.
3. Under "Build and deployment", set the source to **Deploy from a branch**.
4. Select `main` (or `master`) and click **Save**.
5. Your app will be live at `https://[your-username].github.io/[repo-name]`.

### Vercel / Netlify
1. Log into Vercel or Netlify.
2. Select "Add New Project" / "Import from GitHub".
3. Select your repository.
4. Leave build commands blank (since there is no build step).
5. Click **Deploy**.

## 📱 How to Install as an App (PWA)
- **iOS (Safari):** Tap the "Share" icon at the bottom of the screen, scroll down, and tap **"Add to Home Screen"**.
- **Android (Chrome):** Tap the three-dot menu at the top right, and tap **"Install app"** or **"Add to Home screen"**.

## 🖼️ Adding Your Own Icons
The `manifest.json` currently references `icon-192.png` and `icon-512.png`. 
1. Create a square logo for your brand.
2. Use a free tool like [Favicon Generator](https://realfavicongenerator.net/) to generate PWA icons.
3. Place `icon-192.png` and `icon-512.png` in the root folder of the project.

## ⚠️ Troubleshooting
- **Changes aren't showing up?** The Service Worker might be serving a cached version. Do a "Hard Reload" (Ctrl/Cmd + Shift + R), or clear your site data in DevTools.
- **Glass effect doesn't blur?** Ensure you aren't using an extremely old browser. The UI gracefully degrades to semi-transparent backgrounds if `backdrop-filter` is unsupported.
- 
